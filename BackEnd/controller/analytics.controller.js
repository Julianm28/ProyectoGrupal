const Solicitud = require('../models/Solicitud');

// Agrupa solicitudes por mes e insumo
function monthKey(date) {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

// GET /api/analytics/pronostico?months=6&window=3&hospitalId=...
// Pronóstico simple: media móvil de window periodos por insumo.
async function pronosticoDemanda(req, res) {
  try {
    const months = Math.min(Number(req.query.months) || 6, 24);
    const window = Math.min(Number(req.query.window) || 3, 12);
    const { hospitalId } = req.query;

    const since = new Date();
    since.setUTCMonth(since.getUTCMonth() - (months + window + 1));

    const match = { createdAt: { $gte: since } };
    if (hospitalId) match.$or = [{ hospitalId }, { hospital: hospitalId }];

    // Items pueden venir como arreglo con { supplyId, qty }
    const pipeline = [
      { $match: match },
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: {
            insumo: { $ifNull: ['$items.supplyId', { $ifNull: ['$items.insumoId', '$items.id'] }] },
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
          },
          totalQty: { $sum: { $ifNull: ['$items.qty', 1] } },
          countReqs: { $sum: 1 },
        },
      },
      {
        $project: {
          insumo: '$_id.insumo',
          month: { $concat: [{ $toString: '$_id.y' }, '-', { $toString: { $cond: [{ $lt: ['$_id.m', 10] }, { $concat: ['0', { $toString: '$_id.m' }] }, { $toString: '$_id.m' }] } }] },
          totalQty: 1,
          countReqs: 1,
          _id: 0,
        },
      },
      { $sort: { insumo: 1, month: 1 } },
    ];

    const data = await Solicitud.aggregate(pipeline);

    // Re-formatear a series por insumo
    const series = {};
    for (const row of data) {
      if (!row.insumo) continue;
      if (!series[row.insumo]) series[row.insumo] = [];
      series[row.insumo].push({ month: row.month, qty: row.totalQty });
    }

    // Generar eje de meses continuo
    const monthsList = [];
    const start = new Date(since);
    for (let i = 0; i < months + window; i++) {
      const d = new Date(start);
      d.setUTCMonth(start.getUTCMonth() + i);
      monthsList.push(monthKey(d));
    }

    // Rellenar huecos con 0 y calcular MA
    const result = [];
    for (const [insumo, points] of Object.entries(series)) {
      const map = new Map(points.map(p => [p.month, p.qty]));
      const filled = monthsList.map(m => ({ month: m, qty: map.get(m) || 0 }));

      const ma = [];
      for (let i = window - 1; i < filled.length; i++) {
        const slice = filled.slice(i - window + 1, i + 1);
        const avg = slice.reduce((s, x) => s + x.qty, 0) / window;
        ma.push({ month: filled[i].month, forecast: Math.round(avg) });
      }
      // Pronóstico próximo mes: MA de los últimos 'window'
      const lastWindow = filled.slice(-window);
      const nextForecast = Math.round(lastWindow.reduce((s, x) => s + x.qty, 0) / window);

      result.push({
        insumo,
        series: filled,
        movingAverage: ma,
        nextMonthForecast: nextForecast,
      });
    }

    return res.json({ window, monthsEvaluated: months + window, result });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// GET /api/analytics/fraudes?days=30&threshold=3&hospitalId=...
// Señala combinaciones hospital-insumo con z-score alto (solicitudes/qty).
async function deteccionFraudes(req, res) {
  try {
    const days = Math.min(Number(req.query.days) || 30, 180);
    const threshold = Math.min(Number(req.query.threshold) || 3, 10);
    const { hospitalId } = req.query;

    const since = new Date(Date.now() - days * 24 * 3600 * 1000);
    const match = { createdAt: { $gte: since } };
    if (hospitalId) match.$or = [{ hospitalId }, { hospital: hospitalId }];

    const pipeline = [
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            hospital: { $ifNull: ['$hospitalId', '$hospital'] },
            insumo: { $ifNull: ['$items.supplyId', { $ifNull: ['$items.insumoId', '$items.id'] }] },
          },
          qtyTotal: { $sum: { $ifNull: ['$items.qty', 1] } },
          reqs: { $sum: 1 },
        },
      },
      {
        $project: {
          hospital: '$_id.hospital',
          insumo: '$_id.insumo',
          qtyTotal: 1,
          reqs: 1,
          _id: 0,
        },
      },
    ];

    const rows = await (await Solicitud.aggregate(pipeline)).filter(r => r.insumo);

    // Z-score sobre qtyTotal
    const byInsumo = new Map();
    for (const r of rows) {
      if (!byInsumo.has(r.insumo)) byInsumo.set(r.insumo, []);
      byInsumo.get(r.insumo).push(r);
    }

    const anomalies = [];
    for (const [insumo, arr] of byInsumo.entries()) {
      const mean = arr.reduce((s, x) => s + x.qtyTotal, 0) / arr.length;
      const sd = Math.sqrt(arr.reduce((s, x) => s + Math.pow(x.qtyTotal - mean, 2), 0) / (arr.length || 1)) || 0;
      for (const r of arr) {
        const z = sd ? (r.qtyTotal - mean) / sd : 0;
        if (z >= threshold) anomalies.push({ insumo, hospital: r.hospital, qtyTotal: r.qtyTotal, zScore: Number(z.toFixed(2)) });
      }
    }

    return res.json({ days, threshold, anomalies });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  pronosticoDemanda,
  deteccionFraudes,
};