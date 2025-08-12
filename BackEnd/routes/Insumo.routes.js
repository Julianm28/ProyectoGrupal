const express = require("express");
const Insumo = require("../models/Insumo");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const s = new Insumo(req.body);
  await s.save();
  res.json(s);
});

router.get("/", authenticate, async (req, res) => {
  const { search, barcode } = req.query;
  let query = {};
  if (barcode) query.barcode = barcode;
  if (search) query.name = { $regex: search, $options: "i" };
  const list = await Insumo.find(query).populate("categoryId");
  res.json(list);
});

router.get("/:id", authenticate, async (req, res) => {
  const s = await Insumo.findById(req.params.id).populate("categoryId");
  res.json(s);
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  const s = await Insumo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(s);
});

module.exports = router;
