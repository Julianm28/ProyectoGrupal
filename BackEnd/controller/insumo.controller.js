const Insumo = require('../models/Insumo');

// Crear insumo
exports.crearInsumo = async (req, res) => {
  try {
    const insumo = new Insumo(req.body);
    await insumo.save();
    res.status(201).json(insumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos
exports.obtenerInsumos = async (req, res) => {
  const insumos = await Insumo.find();
  res.json(insumos);
};

// Actualizar
exports.actualizarInsumo = async (req, res) => {
  try {
    const insumo = await Insumo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insumo) return res.status(404).json({ error: 'Insumo no encontrado' });
    res.json(insumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar
exports.eliminarInsumo = async (req, res) => {
  const insumo = await Insumo.findByIdAndDelete(req.params.id);
  if (!insumo) return res.status(404).json({ error: 'No encontrado' });
  res.json({ mensaje: 'Insumo eliminado' });
};
