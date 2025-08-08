const Categoria = require('../models/categoria');

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const existente = await Categoria.findOne({ nombre });
    if (existente) {
      return res.status(400).json({ mensaje: 'La categoría ya existe.' });
    }

    const nuevaCategoria = new Categoria({ nombre, descripcion });
    await nuevaCategoria.save();

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear categoría', error });
  }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error });
  }
};