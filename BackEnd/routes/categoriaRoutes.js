const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/Categoria.Controller');

// Crear categoría
router.post('/', categoriaController.crearCategoria);

// Listar categorías
router.get('/', categoriaController.obtenerCategorias);

// Actualizar categoría
router.put('/:id', categoriaController.actualizarCategoria);

// Eliminar categoría
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;
