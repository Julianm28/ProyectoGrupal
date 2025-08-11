const router = require('express').Router();
const ctrl = require('../controller/reporte.controller');

// CSV de solicitudes e inventario
router.get('/solicitudes', ctrl.exportSolicitudesCSV);
router.get('/insumos', ctrl.exportInsumosCSV);

module.exports = router;