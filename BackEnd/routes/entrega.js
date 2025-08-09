const express = require('express');
const router = express.Router();
const entregaController = require('../controller/entrega.Controller');

router.post('/', entregaController.crearEntrega);
router.get('/', entregaController.obtenerEntregas);

module.exports = router;
