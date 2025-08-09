const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema({
  solicitudId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solicitud',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  insumos: [
    {
      insumoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Insumo',
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: [1, 'Debe indicar al menos 1 unidad']
      }
    }
  ],
  fechaEntrega: {
    type: Date,
    default: Date.now
  },
  entregadoPor: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Entrega', entregaSchema);
