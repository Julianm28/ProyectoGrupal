const router = require('express').Router();
const ctrl = require('../controller/solicitudController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Crear solicitud (médico)
router.post('/', authenticate, authorize('medico'), ctrl.crearSolicitud);

// Listar solicitudes (todos los roles autenticados, con filtros por query)
router.get('/', authenticate, authorize('admin', 'bodega', 'medico'), ctrl.listar);

// Mis solicitudes (médico: propias)
router.get('/mias', authenticate, authorize('medico'), ctrl.misSolicitudes);

// Pendientes para gestión (bodega/admin)
router.get('/pendientes', authenticate, authorize('admin', 'bodega'), ctrl.pendientes);

// Flujo de gestión (bodega/admin)
router.post('/:id/aprobar', authenticate, authorize('admin', 'bodega'), ctrl.aprobar);
router.post('/:id/rechazar', authenticate, authorize('admin', 'bodega'), ctrl.rechazar);

// Entrega (solo bodega)
router.post('/:id/entregar', authenticate, authorize('bodega'), ctrl.entregar);

module.exports = router;
