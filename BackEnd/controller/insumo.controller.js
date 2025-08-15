// BackEnd/controller/insumo.controller.js
const Insumo = require('../models/Insumo');

// Filtrado por hospital
function hospitalScopeFromQuery(req) {
  const { hospitalId } = req.query;
  if (!hospitalId) return {};
  return {
    $or: [
      { hospitalId },
      { hospital: hospitalId },
    ],
  };
}

// Crear insumo
async function crearInsumo(req, res) {
  try {
    const body = { ...req.body };
    if (!body.hospitalId && req.query.hospitalId) {
      body.hospitalId = req.query.hospitalId;
    }
    const doc = await Insumo.create(body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Listar insumos (protegido, todos los roles permitidos)
async function listarInsumos(req, res) {
  try {
    const docs = await Insumo.find(hospitalScopeFromQuery(req)).populate('categoria');
    res.json(docs);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Listar insumos público (para médico sin token en /public)
async function listarInsumosPublic(req, res) {
  try {
    const docs = await Insumo.find().populate('categoria');
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener insumos', error: e.message });
  }
}

// Buscar insumos con filtros
async function buscarInsumos(req, res) {
  try {
    const { q, barcode, codigo, limit } = req.query;
    const filter = { ...hospitalScopeFromQuery(req) };
    const or = [];

    if (q) or.push({ nombre: new RegExp(q, 'i') });
    if (barcode) {
      or.push({ barcode }, { codigoBarras: barcode }, { codigo: barcode });
    }
    if (codigo) {
      or.push({ codigo }, { barcode: codigo }, { codigoBarras: codigo });
    }
    if (or.length) filter.$or = or;

    const lim = Math.min(Number(limit) || 50, 200);
    const items = await Insumo.find(filter).limit(lim);
    res.json(items);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Actualizar stock
async function actualizarStock(req, res) {
  try {
    const { id } = req.params;
    const { tipo, qty } = req.body;
    const cantidad = Number(qty);

    if (!['entrada', 'salida'].includes(tipo) || cantidad <= 0) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }

    const doc = await Insumo.findOne({ _id: id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });

    const actual = doc.stock ?? doc.cantidad ?? 0;
    const delta = tipo === 'entrada' ? cantidad : -cantidad;
    const nuevo = actual + delta;

    if (nuevo < 0) return res.status(400).json({ message: 'Stock insuficiente' });

    if ('stock' in doc) doc.stock = nuevo;
    else if ('cantidad' in doc) doc.cantidad = nuevo;
    else doc.stock = nuevo;

    await doc.save();
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Obtener un insumo por ID
async function obtenerPorId(req, res) {
  try {
    const doc = await Insumo.findOne({ _id: req.params.id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Actualizar insumo
async function actualizar(req, res) {
  try {
    const doc = await Insumo.findOneAndUpdate(
      { _id: req.params.id, ...hospitalScopeFromQuery(req) },
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Eliminar insumo
async function eliminar(req, res) {
  try {
    const doc = await Insumo.findOneAndDelete({ _id: req.params.id, ...hospitalScopeFromQuery(req) });
    if (!doc) return res.status(404).json({ message: 'Insumo no encontrado' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

module.exports = {
  crearInsumo,
  listarInsumos,
  listarInsumosPublic,
  buscarInsumos,
  actualizarStock,
  obtenerPorId,
  actualizar,
  eliminar
};
