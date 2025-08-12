const express = require("express");
const Entrega = require("../models/Entrega");
const Insumo = require("../models/Insumo");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/in", authenticate, authorize("bodega"), async (req, res) => {
  const { supplyId, hospitalId, qty, note } = req.body;
  const m = new Entrega({ supplyId, hospitalId, qty, type: "in", userId: req.user.id, note });
  await m.save();
  await Insumo.findByIdAndUpdate(supplyId, { $inc: { currentStock: qty } });
  res.json(m);
});

router.post("/out", authenticate, authorize("bodega"), async (req, res) => {
  const { supplyId, hospitalId, qty, note } = req.body;
  const m = new Entrega({ supplyId, hospitalId, qty, type: "out", userId: req.user.id, note });
  await m.save();
  await Insumo.findByIdAndUpdate(supplyId, { $inc: { currentStock: -qty } });
  res.json(m);
});

module.exports = router;
