const { Parser } = require('json2csv');
const Solicitud = require('../models/Solicitud');
const Insumo = require('../models/Insumo');

// Utilidad: enviar CSV
function sendCSV(res, filename, rows) {
  const parser = new Parser();
  const csv = parser.parse(rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
}

// GET /api/reportes/solicitudes?from=YYYY-MM-DD&to=YYYY-MM-DD&estado=pendiente|aprobada|entregada&hospitalId=...
async function exportSolicitudesCSV(req, res) {
  try {
    const { from, to, estado, hospitalId } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;
    if (hospitalId) filter.$or = [{ hospitalId }, { hospital: hospitalId }];
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }
    const docs = await Solicitud.find(filter).lean();

    const rows = docs.map(d => ({
      id: String(d._id),
      fecha: d.createdAt ? new Date(d.createdAt).toISOString().slice(0, 19).replace('T', ' ') : '',
      solicitanteId: d.solicitanteId || '',
      hospital: d.hospitalId || d.hospital || '',
      prioridad: d.prioridad || '',
      estado: d.estado || '',
      items: Array.isArray(d.items) ? d.items.map(i => `${i.supplyId || i.insumoId || i.id}:${i.qty}`).join('|') : '',
      comentarios: d.comentarios || '',
    }));

    return sendCSV(res, 'solicitudes.csv', rows);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// GET /api/reportes/insumos?hospitalId=...
// Exporta snapshot de inventario con stock y mínimos (según los campos que tengas).
async function exportInsumosCSV(req, res) {
  try {
    const { hospitalId } = req.query;
    const filter = {};
    if (hospitalId) filter.$or = [{ hospitalId }, { hospital: hospitalId }];

    const items = await Insumo.find(filter).lean();
    const rows = items.map(i => ({
      id: String(i._id),
      nombre: i.nombre || '',
      codigo: i.codigo || i.barcode || i.codigoBarras || '',
      categoria: i.categoriaId || i.categoria || '',
      stock: i.stock ?? i.cantidad ?? 0,
      minStock: i.minStock ?? i.stockMinimo ?? '',
      hospital: i.hospitalId || i.hospital || '',
    }));

    return sendCSV(res, 'inventario.csv', rows);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  exportSolicitudesCSV,
  exportInsumosCSV,
};