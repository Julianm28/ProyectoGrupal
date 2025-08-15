// BackEnd/routes/alertas.js
const router = require('express').Router();
const Insumo = require('../models/Insumo');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET /api/alertas - Solo admin puede ver alertas
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const docs = await Insumo.find({}, { nombre: 1, stock: 1, stockMinimo: 1, minStock: 1 }).lean();

    const alertas = (docs || [])
      .map(d => {
        const minimo = (typeof d.stockMinimo === 'number') ? d.stockMinimo : d.minStock;
        return {
          insumoId: d._id,
          nombre: d.nombre,
          stock: d.stock,
          stockMinimo: minimo,
          tipo: (typeof d.stock === 'number' && typeof minimo === 'number' && d.stock <= 0)
              ? 'sin_stock'
              : (typeof d.stock === 'number' && typeof minimo === 'number' && d.stock <= minimo)
                ? 'bajo_stock'
                : 'ok'
        };
      })
      .filter(a => a.tipo !== 'ok');

    return res.json(alertas);
  } catch (err) {
    console.error('Error en GET /api/alertas:', err);
    return res.status(500).json([]);
  }
});

module.exports = router;
