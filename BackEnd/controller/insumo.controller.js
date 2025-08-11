const Insumo = require('../models/Insumo');

// Si quieres filtrar por hospital desde el front, pasa ?hospitalId=... en la URL
function hospitalScopeFromQuery(req) {
  const { hospitalId } = req.query;
  if (!hospitalId) return {};
  return {
    $or: [
      { hospitalId },
      { hospital: hospitalId }, // si tu modelo usa 'hospital' en lugar de 'hospitalId'
    ],
  };
}

// Crea un insumo
async function crearInsumo(req, res) {
  try {
    const body = { ...req.body };
    // Si quieres forzar hospitalId desde query cuando no viene en el body:
    if (!body.hospitalId && !body.hospital && req.query.hospitalId) {
      body.hospitalId = req.query.hospitalId;
    }
    const doc = await Insumo.create(body);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Busca/lista insumos por nombre o código de barras/código
async function buscarInsumos(req, res) {
  try {
    const { q, barcode, codigo, limit } = req.query;
    const filter = { ...hospitalScopeFromQuery(req) };
    const or = [];
    if (q) or.push({ nombre: new RegExp(q, 'i') });
    if (barcode) {
      or.push({ barcode });
      or.push({ codigoBarras: barcode });
      or.push({ codigo: barcode });
    }
    if (codigo) {
      or.push({ codigo });
      or.push({ barcode: codigo });
      or.push({ codigoBarras: codigo });
    }
    if (or.length) filter.$or = or;

    const lim = Math.min(Number(limit) || 50, 200);
    const items = await Insumo.find(filter).limit(lim);
    return res.json(items);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Actualiza stock: { tipo: 'entrada'|'salida', qty: number }
async function actualizarStock(req, res) {
  try {
    const { id } = req.params;
    const { tipo, qty } = req.body;
    const cantidad = Number(qty);
    if (!['entrada', 'salida'].includes(tipo) || !Number.isFinite(cantidad) || cantidad <= 0) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const doc = await Insumo.findOne({ _id: id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });

    // Soporta 'stock' o 'cantidad' según tu modelo
    const usaStock = Object.prototype.hasOwnProperty.call(doc, 'stock');
    const usaCantidad = Object.prototype.hasOwnProperty.call(doc, 'cantidad');
    const actual = usaStock ? (doc.stock || 0) : usaCantidad ? (doc.cantidad || 0) : (doc.stock || doc.cantidad || 0);

    const delta = tipo === 'entrada' ? cantidad : -cantidad;
    const nuevo = actual + delta;
    if (nuevo < 0) return res.status(400).json({ message: 'Stock insuficiente' });

    if (usaStock) doc.stock = nuevo;
    else if (usaCantidad) doc.cantidad = nuevo;
    else doc.stock = nuevo; // crea el campo si no existe

    await doc.save();
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// CRUD básicos opcionales
async function listar(req, res) {
  try {
    const docs = await Insumo.find(hospitalScopeFromQuery(req));
    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const doc = await Insumo.findOne({ _id: req.params.id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function actualizar(req, res) {
  try {
    const doc = await Insumo.findOneAndUpdate(
      { _id: req.params.id, ...hospitalScopeFromQuery(req) },
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function eliminar(req, res) {
  try {
    const doc = await Insumo.findOneAndDelete({ _id: req.params.id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  crearInsumo,
  buscarInsumos,
  actualizarStock,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
};