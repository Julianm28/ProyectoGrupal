const router = require('express').Router();
const Hospital = require('../models/Hospital');

// GET /api/mapa/hospitales
// Devuelve hospitales con lat/lng (si no tienes coords, añade luego con un PUT normal).
router.get('/hospitales', async (req, res) => {
  try {
    const docs = await Hospital.find({}).lean();
    const data = docs.map(h => ({
      id: String(h._id),
      nombre: h.nombre || h.name || 'Hospital',
      tipo: h.tipo || h.category || '',
      lat: h.lat ?? (h.location?.lat ?? null),
      lng: h.lng ?? (h.location?.lng ?? null),
      direccion: h.direccion || h.address || '',
      telefono: h.telefono || h.phone || '',
    })).filter(h => h.lat != null && h.lng != null);
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;