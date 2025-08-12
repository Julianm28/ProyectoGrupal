const router = require('express').Router();
const ctrl = require('../controller/insumo.controller');

// Inventario
router.post('/', ctrl.crearInsumo);
router.get('/', ctrl.buscarInsumos);          // soporta ?q=, ?barcode=, ?codigo=, ?hospitalId=
router.patch('/:id/stock', ctrl.actualizarStock);

// CRUD opcional
router.get('/:id', ctrl.obtenerPorId);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;