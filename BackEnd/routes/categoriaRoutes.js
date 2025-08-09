const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/Categoria.Controller');

router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.obtenerCategorias);

module.exports = router;
