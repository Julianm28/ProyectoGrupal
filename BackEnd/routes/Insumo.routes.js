// BackEnd/routes/Insumo.routes.js
const router = require('express').Router();
const {
  crearInsumo,
  listarInsumos,
  listarInsumosPublic,
  buscarInsumos,
  actualizarStock,
  obtenerPorId,
  actualizar,
  eliminar
} = require('../controller/insumo.controller');

const { authenticate, authorize } = require('../middleware/authMiddleware');

// Ruta pública (para médicos sin login si quieres)
router.get('/public', listarInsumosPublic);

// Ruta protegida para listar todos los insumos
router.get('/', authenticate, authorize('admin', 'medico', 'bodega'), listarInsumos);

// Crear insumo (solo admin y bodega)
router.post('/', authenticate, authorize('admin', 'bodega'), crearInsumo);

// Buscar insumos con filtros
router.get('/search', authenticate, authorize('admin', 'medico', 'bodega'), buscarInsumos);

// Actualizar stock
router.patch('/:id/stock', authenticate, authorize('admin', 'bodega'), actualizarStock);

// Obtener un insumo por ID
router.get('/:id', authenticate, authorize('admin', 'medico', 'bodega'), obtenerPorId);

// Actualizar insumo
router.put('/:id', authenticate, authorize('admin', 'bodega'), actualizar);

// Eliminar insumo
router.delete('/:id', authenticate, authorize('admin'), eliminar);

module.exports = router;
