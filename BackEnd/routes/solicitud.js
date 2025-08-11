const router = require('express').Router();
const ctrl = require('../controller/solicitudController');

// Crear y listar
router.post('/', ctrl.crearSolicitud);       // body: { prioridad, items, solicitanteId?, ... }
router.get('/', ctrl.listarTodas);           // opcional ?hospitalId=

// "Mis" solicitudes por solicitanteId
router.get('/mias', ctrl.misSolicitudes);    // requiere ?solicitanteId=

// Flujo de gestión
router.get('/pendientes', ctrl.pendientes);  // opcional ?hospitalId=
router.post('/:id/aprobar', ctrl.aprobar);
router.post('/:id/rechazar', ctrl.rechazar);
router.post('/:id/entregada', ctrl.marcarEntregada);

module.exports = router;