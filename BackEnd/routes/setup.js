
const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Insumo = require('../models/Insumo');
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');

// Devuelve conteos para saber si hay que mostrar onboarding
router.get('/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const hospitals = await Hospital.countDocuments();
    const insumos = await Insumo.countDocuments();
    const users = await User.countDocuments();
    return res.json({ hospitals, insumos, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al consultar estado' });
  }
});

module.exports = router;
