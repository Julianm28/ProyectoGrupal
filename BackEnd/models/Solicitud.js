const mongoose = require('mongoose');

const SolicitudSchema = new mongoose.Schema({
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
    enum: ['Urgente', 'Rutinario'],
    required: [true, 'Debe indicar la prioridad']
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'Debe indicar el hospital solicitante']
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobada', 'Entregada', 'Rechazada'],
    default: 'Pendiente'
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  fechaAtencion: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', SolicitudSchema);
