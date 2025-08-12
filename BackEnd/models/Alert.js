const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  insumoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Insumo', required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  visto: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', AlertSchema);
