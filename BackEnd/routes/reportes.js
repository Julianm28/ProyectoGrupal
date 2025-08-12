const express = require("express");
const Solicitud = require("../models/Solicitud");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// Reporte simple por fechas (devuelve JSON). Puedes ampliar para PDF/Excel.
router.get("/solicitudes", authenticate, authorize("admin"), async (req, res) => {
  const { from, to } = req.query;
  const q = {};
  if (from || to) q.createdAt = {};
  if (from) q.createdAt.$gte = new Date(from);
  if (to) q.createdAt.$lte = new Date(to);
  const list = await Solicitud.find(q).populate("requesterId items.supplyId hospitalId");
  res.json(list);
});

module.exports = router;
