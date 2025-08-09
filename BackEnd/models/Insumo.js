const mongoose = require('mongoose');

const InsumoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del insumo es obligatorio']
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoría es obligatoria']
  },
  cantidad: {
    type: Number,
    default: 0
  },
  stockMinimo: {
    type: Number,
    default: 10
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Insumo', InsumoSchema);
