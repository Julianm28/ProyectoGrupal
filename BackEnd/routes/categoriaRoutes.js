const express = require("express");
const Categoria = require("../models/categoria");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, authorize("admin"), async (req, res) => {
  const c = new Categoria(req.body);
  await c.save();
  res.json(c);
});

router.get("/", authenticate, async (req, res) => {
  const list = await Categoria.find();
  res.json(list);
});

module.exports = router;
