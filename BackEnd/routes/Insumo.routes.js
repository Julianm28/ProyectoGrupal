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

// Buscar insumos con filtros (acepta ?q= o ?search=)
router.get('/search', authenticate, authorize('admin', 'medico', 'bodega'), buscarInsumos);

// Alias para permitir que "?search=" funcione igual que "/search"
router.get('/', authenticate, authorize('admin', 'medico', 'bodega'), (req, res, next) => {
  if (req.query.search || req.query.q || req.query.barcode || req.query.codigo) {
    return buscarInsumos(req, res);
  }
  return listarInsumos(req, res);
});

// Crear insumo (solo admin y bodega)
router.post('/', authenticate, authorize('admin', 'bodega'), crearInsumo);

// Actualizar stock
router.patch('/:id/stock', authenticate, authorize('admin', 'bodega'), actualizarStock);

// Obtener un insumo por ID
router.get('/:id', authenticate, authorize('admin', 'medico', 'bodega'), obtenerPorId);

// Actualizar insumo
router.put('/:id', authenticate, authorize('admin', 'bodega'), actualizar);

// Eliminar insumo
router.delete('/:id', authenticate, authorize('admin'), eliminar);

module.exports = router;
