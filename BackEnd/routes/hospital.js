const express = require('express');
const router = express.Router();
const hospitalController = require('../controller/hospital.Controller');
const { authenticate, authorize } = require("../middleware/authMiddleware");
// CRUD Hospital
router.post('/', authenticate, authorize('admin'), hospitalController.crearHospital);
router.get('/', hospitalController.listarHospitales);
router.get('/:id', hospitalController.obtenerHospital);
router.put('/:id', authenticate, authorize('admin'), hospitalController.actualizarHospital);
router.delete('/:id', authenticate, authorize('admin'), hospitalController.eliminarHospital);

module.exports = router;
