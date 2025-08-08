const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.post('/', categoriaController.crearCategoria);
router.get('/', categoriaController.obtenerCategorias);

module.exports = router;
