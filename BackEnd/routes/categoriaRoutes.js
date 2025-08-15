// BackEnd/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/Categoria.Controller');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Crear categoría (solo admin)
router.post('/', authenticate, authorize('admin'), categoriaController.crearCategoria);

// Listar categorías (solo admin)
router.get('/', authenticate, authorize('admin'), categoriaController.obtenerCategorias);

// Actualizar categoría (solo admin)
router.put('/:id', authenticate, authorize('admin'), categoriaController.actualizarCategoria);

// Eliminar categoría (solo admin)
router.delete('/:id', authenticate, authorize('admin'), categoriaController.eliminarCategoria);

module.exports = router;
