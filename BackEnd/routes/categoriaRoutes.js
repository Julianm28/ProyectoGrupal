const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/Categoria.Controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// ✅ GET público para que médicos puedan listar categorías
router.get('/', categoriaController.obtenerCategorias);

// Crear categoría (solo admin)
router.post('/', authenticate, authorize('admin'), categoriaController.crearCategoria);

// Actualizar categoría (solo admin)
router.put('/:id', authenticate, authorize('admin'), categoriaController.actualizarCategoria);

// Eliminar categoría (solo admin)
router.delete('/:id', authenticate, authorize('admin'), categoriaController.eliminarCategoria);

module.exports = router;
