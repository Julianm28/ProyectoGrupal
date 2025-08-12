const express = require('express');
const router = express.Router();
const hospitalController = require('../controller/hospital.Controller');
const { auth, permit } = require('../middleware/auth');

// CRUD Hospital
router.post('/', auth, permit('admin'), hospitalController.crearHospital);
router.get('/', hospitalController.listarHospitales);
router.get('/:id', hospitalController.obtenerHospital);
router.put('/:id', auth, permit('admin'), hospitalController.actualizarHospital);
router.delete('/:id', auth, permit('admin'), hospitalController.eliminarHospital);

module.exports = router;
