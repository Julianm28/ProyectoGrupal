const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const reportesCtrl = require('../controller/reporte.controller');

// RUTA: /api/reportes/insumos-mas-solicitados
router.get(
  '/insumos-mas-solicitados',
  authenticate,
  authorize('admin', 'bodega'),
  reportesCtrl.insumosMasSolicitados
);

module.exports = router;
