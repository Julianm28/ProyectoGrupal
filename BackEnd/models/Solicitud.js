const mongoose = require("mongoose");

const solicitudSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  items: [{
    supplyId: { type: mongoose.Schema.Types.ObjectId, ref: "Insumo", required: true },
    qty: { type: Number, required: true },
    priority: { type: String, enum: ["urgente", "rutinario"], default: "rutinario" }
  }],
  status: { type: String, enum: ["pendiente","aprobada","rechazada","entregada"], default: "pendiente" },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Solicitud", solicitudSchema);
