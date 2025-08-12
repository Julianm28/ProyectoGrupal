const express = require("express");
const Hospital = require("../models/Hospital");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const h = new Hospital(req.body);
  await h.save();
  res.json(h);
});

router.get("/", authenticate, async (req, res) => {
  const list = await Hospital.find();
  res.json(list);
});

router.get("/:id", authenticate, async (req, res) => {
  const h = await Hospital.findById(req.params.id);
  res.json(h);
});

router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  const h = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(h);
});

router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  await Hospital.findByIdAndDelete(req.params.id);
  res.json({ msg: "Eliminado" });
});

module.exports = router;
