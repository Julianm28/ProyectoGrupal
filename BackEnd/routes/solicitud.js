const express = require("express");
const Solicitud = require("../models/Solicitud");
const Insumo = require("../models/Insumo");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// Crear solicitud (medico)
router.post("/", authenticate, authorize("medico"), async (req, res) => {
  const { hospitalId, items } = req.body;
  const r = new Solicitud({ requesterId: req.user.id, hospitalId, items });
  await r.save();
  res.json(r);
});

// Listar (opcional filtro)
router.get("/", authenticate, async (req, res) => {
  const { status } = req.query;
  const q = status ? { status } : {};
  if (req.user.role === "medico") q.requesterId = req.user.id;
  const list = await Solicitud.find(q).populate("requesterId items.supplyId hospitalId");
  res.json(list);
});

// Aprobar (bodega)
router.post("/:id/approve", authenticate, authorize("bodega"), async (req, res) => {
  const r = await Solicitud.findById(req.params.id);
  if (!r) return res.status(404).json({ msg: "No encontrado" });
  if (r.status !== "pendiente") return res.status(400).json({ msg: "Solicitud no en estado pendiente" });
  r.status = "aprobada";
  r.approverId = req.user.id;
  await r.save();
  // disminuir stock según items
  for (const it of r.items) {
    await Insumo.findByIdAndUpdate(it.supplyId, { $inc: { currentStock: -it.qty } });
  }
  res.json(r);
});

// Rechazar
router.post("/:id/reject", authenticate, authorize("bodega"), async (req, res) => {
  const r = await Solicitud.findByIdAndUpdate(req.params.id, { status: "rechazada", approverId: req.user.id }, { new: true });
  res.json(r);
});

module.exports = router;
