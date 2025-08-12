const express = require("express");
const Insumo = require("../models/Insumo");
const Solicitud = require("../models/Solicitud");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// Ejemplo: top insumos solicitados (simple agregación)
router.get("/top-supplies", authenticate, authorize(["admin"]), async (req, res) => {
  const ag = await Solicitud.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.supplyId", totalQty: { $sum: "$items.qty" } } },
    { $sort: { totalQty: -1 } },
    { $limit: 10 }
  ]);
  res.json(ag);
});

module.exports = router;
