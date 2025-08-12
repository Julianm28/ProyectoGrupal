const mongoose = require("mongoose");

const entregaSchema = new mongoose.Schema({
  supplyId: { type: mongoose.Schema.Types.ObjectId, ref: "Insumo", required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  type: { type: String, enum: ["in","out","adjust"], required: true },
  qty: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String
}, { timestamps: true });

module.exports = mongoose.model("Entrega", entregaSchema);
