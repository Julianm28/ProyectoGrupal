const express = require('express');
const router = express.Router();
const hospitalController = require('../controller/hospital.Controller');

// CRUD Hospital
router.post('/', hospitalController.crearHospital);
router.get('/', hospitalController.listarHospitales);
router.get('/:id', hospitalController.obtenerHospital);
router.put('/:id', hospitalController.actualizarHospital);
router.delete('/:id', hospitalController.eliminarHospital);

module.exports = router;
