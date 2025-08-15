// BackEnd/models/Hospital.js
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String, required: true },
   codigo: { type: String, unique: true, sparse: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);
