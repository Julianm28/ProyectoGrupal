const express = require('express');
const router = express.Router();

const insumoController = require('../controller/insumo.controller');

// Rutas de insumos
router.post('/', insumoController.crearInsumo);
router.get('/', insumoController.obtenerInsumos);
router.get('/:id', insumoController.obtenerInsumoPorId);
router.put('/:id', insumoController.actualizarInsumo);
router.delete('/:id', insumoController.eliminarInsumo);

module.exports = router;
