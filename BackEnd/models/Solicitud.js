// /BackEnd/models/Solicitud.js
const mongoose = require('mongoose');

const estados = ['Pendiente', 'Aprobada', 'Entregada', 'Rechazada'];
const prioridades = ['Urgente', 'Rutinario'];

const SolicitudSchema = new mongoose.Schema({
  // Un (1) insumo por solicitud (simple y claro para el flujo Médico → Bodega)
  insumo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Insumo',
    required: [true, 'Debe indicar el insumo solicitado']
  },
  cantidad: {
    type: Number,
    required: [true, 'Debe indicar la cantidad solicitada'],
    min: [1, 'La cantidad debe ser al menos 1']
  },
  prioridad: {
    type: String,
    enum: prioridades,
    required: [true, 'Debe indicar la prioridad (Urgente/Rutinario)']
  },
  descripcion: {
    type: String,
    trim: true
  },

  // Hospital solicitante (obligatorio para trazabilidad)
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Debe indicar el hospital solicitante']
  },

  // Solicitante (médico)
  solicitanteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Debe indicar el usuario solicitante']
  },

  // Estado del flujo
  estado: {
    type: String,
    enum: estados,
    default: 'Pendiente'
  },

  // Auditoría del flujo
  aprobadoPorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entregadoPorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  fechaSolicitud: { type: Date, default: Date.now },
  fechaAtencion: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', SolicitudSchema);
