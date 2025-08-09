const express = require('express');
const router = express.Router();
const solicitudController = require('../controller/solicitudController');

router.post('/', solicitudController.crearSolicitud);
router.get('/', solicitudController.listarSolicitudes);
router.put('/:id/estado', solicitudController.actualizarEstado);

module.exports = router;
