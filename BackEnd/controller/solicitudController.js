// /BackEnd/controller/solicitudController.js
const mongoose = require('mongoose');
const Solicitud = require('../models/Solicitud');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
// Crear solicitud (rol: medico) con opción de insumo nuevo
// Body esperado: { insumo, cantidad, prioridad, descripcion?, hospital }
async function crearSolicitud(req, res) {
  try {
    const { insumo, cantidad, prioridad, descripcion, hospital } = req.body;
    const solicitanteId = req.user?.id; // viene del token

    if (!insumo || !cantidad || !prioridad || !hospital) {
      return res.status(400).json({ message: 'insumo, cantidad, prioridad y hospital son obligatorios' });
    }

    if (!isValidId(hospital)) {
      return res.status(400).json({ message: 'hospital inválido' });
    }

    if (!solicitanteId || !isValidId(solicitanteId)) {
      return res.status(400).json({ message: 'Usuario solicitante inválido' });
    }

    if (!['Urgente', 'Rutinario'].includes(prioridad)) {
      return res.status(400).json({ message: 'prioridad debe ser Urgente o Rutinario' });
    }

    let insumoId = insumo;

    // Si el insumo no es un ObjectId válido, lo creamos
    if (!isValidId(insumo)) {
      const Insumo = require('../models/Insumo');
      const nuevoInsumo = await Insumo.create({
        nombre: insumo,
        stock: 0, // empieza en cero
        stockMinimo: 0, // sin mínimo por defecto
      });
      insumoId = nuevoInsumo._id;
    }

    const doc = await Solicitud.create({
      insumo: insumoId,
      cantidad: parseInt(cantidad, 10),
      prioridad,
      descripcion: descripcion || '',
      hospital,
      solicitanteId,
      estado: 'Pendiente'
    });

    return res.status(201).json(doc);
  } catch (e) {
    console.error('Error en crearSolicitud:', e);
    return res.status(400).json({ message: e.message });
  }
}


// Listar solicitudes (admin/bodega/medico con filtros)
// Query opcional: ?hospital=...&estado=Pendiente|Aprobada|Entregada|Rechazada&prioridad=Urgente|Rutinario
async function listar(req, res) {
  try {
    const { hospital, estado, prioridad } = req.query;
    const filtro = {};

    if (hospital) {
      if (!isValidId(hospital)) return res.status(400).json({ message: 'hospital inválido' });
      filtro.hospital = hospital;
    }
    if (estado) {
      if (!['Pendiente', 'Aprobada', 'Entregada', 'Rechazada'].includes(estado)) {
        return res.status(400).json({ message: 'estado inválido' });
      }
      filtro.estado = estado;
    }
    if (prioridad) {
      if (!['Urgente', 'Rutinario'].includes(prioridad)) {
        return res.status(400).json({ message: 'prioridad inválida' });
      }
      filtro.prioridad = prioridad;
    }

    const docs = await Solicitud
      .find(filtro)
      .populate('insumo', 'nombre codigoBarra')
      .populate('hospital', 'nombre ubicacion')
      .populate('solicitanteId', 'nombre email role')
      .sort('-createdAt');

    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Mis solicitudes (rol: medico)
// Query: ?estado=... (opcional)
async function misSolicitudes(req, res) {
  try {
    const solicitanteId = req.user?.id;
    if (!solicitanteId || !isValidId(solicitanteId)) {
      return res.status(400).json({ message: 'Usuario inválido' });
    }
    const filtro = { solicitanteId };
    const { estado } = req.query;
    if (estado) {
      if (!['Pendiente', 'Aprobada', 'Entregada', 'Rechazada'].includes(estado)) {
        return res.status(400).json({ message: 'estado inválido' });
      }
      filtro.estado = estado;
    }

    const docs = await Solicitud
      .find(filtro)
      .populate('insumo', 'nombre codigoBarra')
      .populate('hospital', 'nombre ubicacion')
      .sort('-createdAt');

    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Pendientes (rol: bodega/admin) — opcionalmente filtrar por hospital ?hospital=...
async function pendientes(req, res) {
  try {
    const { hospital } = req.query;
    const filtro = { estado: 'Pendiente' };
    if (hospital) {
      if (!isValidId(hospital)) return res.status(400).json({ message: 'hospital inválido' });
      filtro.hospital = hospital;
    }

    const docs = await Solicitud
      .find(filtro)
      .populate('insumo', 'nombre codigoBarra')
      .populate('hospital', 'nombre')
      .populate('solicitanteId', 'nombre email')
      .sort('fechaSolicitud');

    return res.json(docs);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Aprobar (rol: bodega/admin)
async function aprobar(req, res) {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: 'id inválido' });

    const updates = { estado: 'Aprobada', aprobadoPorId: req.user?.id, fechaAtencion: new Date() };
    const doc = await Solicitud.findOneAndUpdate(
      { _id: id, estado: 'Pendiente' },
      updates,
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada o no está Pendiente' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Rechazar (rol: bodega/admin)
async function rechazar(req, res) {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: 'id inválido' });

    const updates = { estado: 'Rechazada', aprobadoPorId: req.user?.id, fechaAtencion: new Date() };
    const doc = await Solicitud.findOneAndUpdate(
      { _id: id, estado: 'Pendiente' },
      updates,
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada o no está Pendiente' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

// Marcar entregada (rol: bodega)
async function entregar(req, res) {
  try {
    const id = req.params.id;
    if (!isValidId(id)) return res.status(400).json({ message: 'id inválido' });

    const updates = { estado: 'Entregada', entregadoPorId: req.user?.id };
    const doc = await Solicitud.findOneAndUpdate(
      { _id: id, estado: 'Aprobada' },
      updates,
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: 'Solicitud no encontrada o no está Aprobada' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = {
  crearSolicitud,
  listar,
  misSolicitudes,
  pendientes,
  aprobar,
  rechazar,
  entregar
};
