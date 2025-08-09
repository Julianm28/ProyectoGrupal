const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del hospital es obligatorio'],
    unique: true
  },
  codigo: {
    type: String,
    required: [true, 'El código del hospital es obligatorio'],
    unique: true
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria']
  },
  telefono: {
    type: String,
    match: [/^[0-9]{8}$/, 'El teléfono debe tener 8 dígitos']
  },
  tipo: {
    type: String,
    enum: ['Hospital', 'Clínica'],
    required: [true, 'Debe indicar el tipo']
  },
  capacidadPacientes: {
    type: Number,
    min: [0, 'La capacidad no puede ser negativa']
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
