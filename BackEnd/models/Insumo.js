const mongoose = require('mongoose');

const InsumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  categoria: {
    type: String,
    enum: ['medicamento', 'equipo'],
    required: [true, 'La categoría es obligatoria']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  stockMinimo: {
    type: Number,
    default: 5,
    min: [0, 'El stock mínimo no puede ser negativo']
  }
}, { timestamps: true });

module.exports = mongoose.model('Insumo', InsumoSchema);
