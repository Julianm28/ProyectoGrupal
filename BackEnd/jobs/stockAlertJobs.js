const cron = require('node-cron');
const Insumo = require('../models/Insumo');

// Ajusta nombres de campos si tu modelo usa otros (ej: cantidadMinima)
async function checkMinStock() {
  // Dos consultas para soportar variantes de nombres
  const porStock = await Insumo.find({
    $expr: { $lt: [ '$stock', { $ifNull: ['$minStock', Number.MAX_SAFE_INTEGER] } ] },
  }).lean();

  const porCantidad = await Insumo.find({
    $expr: { $lt: [ '$cantidad', { $ifNull: ['$stockMinimo', Number.MAX_SAFE_INTEGER] } ] },
  }).lean();

  const vistos = new Set();
  const items = [...porStock, ...porCantidad].filter(i => {
    const key = String(i._id);
    if (vistos.has(key)) return false;
    vistos.add(key);
    return true;
  });

  for (const i of items) {
    const actual = i.stock ?? i.cantidad ?? 0;
    const minimo = i.minStock ?? i.stockMinimo ?? 0;
    console.warn(`[ALERTA STOCK] ${i.nombre || i._id} => ${actual}/${minimo}`);
  }
}

function start() {
  cron.schedule('*/10 * * * *', () => {
    checkMinStock().catch(err => console.error('Error alerta stock', err.message));
  });
  console.log('Job de alertas de stock programado (cada 10 min)');
}

module.exports = { start, checkMinStock };