const express = require("express");
const router = express.Router();

// IMPORTAR AMBOS DESDE EL MISMO ARCHIVO
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  res.json({ message: "Ruta de alertas para admin" });
});

module.exports = router;
