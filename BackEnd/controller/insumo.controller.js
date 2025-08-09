const Insumo = require('../models/Insumo');

// Crear un nuevo insumo
exports.crearInsumo = async (req, res) => {
  try {
    const nuevoInsumo = new Insumo(req.body);
    const insumoGuardado = await nuevoInsumo.save();
    res.status(201).json(insumoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los insumos (con la categoría populada)
exports.obtenerInsumos = async (req, res) => {
  try {
    const insumos = await Insumo.find().populate('categoria', 'nombre descripcion');
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un insumo por ID
exports.obtenerInsumoPorId = async (req, res) => {
  try {
    const insumo = await Insumo.findById(req.params.id).populate('categoria', 'nombre descripcion');
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.json(insumo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un insumo
exports.actualizarInsumo = async (req, res) => {
  try {
    const insumoActualizado = await Insumo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insumoActualizado) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.json(insumoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un insumo
exports.eliminarInsumo = async (req, res) => {
  try {
    const insumoEliminado = await Insumo.findByIdAndDelete(req.params.id);
    if (!insumoEliminado) {
      return res.status(404).json({ error: 'Insumo no encontrado' });
    }
    res.json({ mensaje: 'Insumo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
