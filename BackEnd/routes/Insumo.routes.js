const express = require('express');
const router = express.Router();
const insumoCtrl = require('../controllers/insumo.controller');

router.post('/', insumoCtrl.crearInsumo);
router.get('/', insumoCtrl.obtenerInsumos);
router.put('/:id', insumoCtrl.actualizarInsumo);
router.delete('/:id', insumoCtrl.eliminarInsumo);

module.exports = router;
