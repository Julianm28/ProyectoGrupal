const Solicitud = require('../models/Solicitud');

// Permite filtrar por hospital vía ?hospitalId=...
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

// Crear solicitud. Espera en body: { prioridad, items: [{supplyId, qty}], solicitanteId?, comentarios? }
async function crearSolicitud(req, res) {
  try {
    const body = { ...req.body };
    body.estado = body.estado || 'pendiente';
    // Si no viene hospital en el body y pasas ?hospitalId=..., lo agregamos
    if (!body.hospitalId && !body.hospital && req.query.hospitalId) {
      body.hospitalId = req.query.hospitalId;
    }
    const doc = await Solicitud.create(body);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Listar todas (opcionalmente filtra por hospital)
async function listarTodas(req, res) {
  try {
    const docs = await Solicitud.find(hospitalScopeFromQuery(req)).sort('-createdAt');
    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// "Mis" solicitudes: usa ?solicitanteId=... para filtrar
async function misSolicitudes(req, res) {
  try {
    const { solicitanteId } = req.query;
    if (!solicitanteId) return res.status(400).json({ message: 'Falta solicitanteId' });
    const docs = await Solicitud.find({ solicitanteId }).sort('-createdAt');
    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Pendientes por hospital (opcionalmente usa ?hospitalId=...)
async function pendientes(req, res) {
  try {
    const filtro = { ...hospitalScopeFromQuery(req), estado: 'pendiente' };
    const docs = await Solicitud.find(filtro).sort('-createdAt');
    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Aprobar/Rechazar/Entregar. Puedes enviar en body: { actorId?, comentarios? }
async function aprobar(req, res) {
  try {
    const updates = { estado: 'aprobada' };
    if (req.body?.actorId) updates.aprobadoPorId = req.body.actorId;
    const doc = await Solicitud.findOneAndUpdate(
      { _id: req.params.id, ...hospitalScopeFromQuery(req) },
      updates,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function rechazar(req, res) {
  try {
    const updates = { estado: 'rechazada' };
    if (req.body?.actorId) updates.aprobadoPorId = req.body.actorId;
    const doc = await Solicitud.findOneAndUpdate(
      { _id: req.params.id, ...hospitalScopeFromQuery(req) },
      updates,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

async function marcarEntregada(req, res) {
  try {
    const updates = { estado: 'entregada' };
    if (req.body?.actorId) updates.entregadoPorId = req.body.actorId;
    const doc = await Solicitud.findOneAndUpdate(
      { _id: req.params.id, estado: 'aprobada', ...hospitalScopeFromQuery(req) },
      updates,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada o no está aprobada' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  crearSolicitud,
  listarTodas,
  misSolicitudes,
  pendientes,
  aprobar,
  rechazar,
  marcarEntregada,
};