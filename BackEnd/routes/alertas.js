const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Alert = require('../models/Alert');

// Obtener todas las alertas
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  const alertas = await Alert.find().populate('insumoId');
  res.json(alertas);
});

// Marcar alerta como vista
router.put('/:id/visto', authenticate, authorize('admin'), async (req, res) => {
  await Alert.findByIdAndUpdate(req.params.id, { visto: true });
  res.json({ message: 'Alerta marcada como vista' });
});

module.exports = router;
