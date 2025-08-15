// BackEnd/controller/hospital.controller.js
const Hospital = require('../models/Hospital');

// Crear hospital
exports.crearHospital = async (req, res) => {
  try {
    const { nombre, ubicacion, codigo } = req.body;

    if (!nombre || !ubicacion) {
      return res.status(400).json({ mensaje: 'Nombre y ubicación son obligatorios' });
    }

    // Generar un código único si no se envía
    const codigoFinal = codigo?.trim() || `HOSP-${Date.now()}`;

    const nuevoHospital = await Hospital.create({
      nombre: nombre.trim(),
      ubicacion: ubicacion.trim(),
      codigo: codigoFinal
    });

    res.status(201).json(nuevoHospital);
  } catch (error) {
    console.error('Error al crear hospital:', error);

    // Manejo específico para clave duplicada
    if (error.code === 11000 && error.keyPattern?.codigo) {
      return res.status(400).json({ mensaje: 'Ya existe un hospital con este código' });
    }

    res.status(500).json({ mensaje: 'Error al crear hospital', error: error.message });
  }
};

// Listar hospitales
exports.listarHospitales = async (req, res) => {
  try {
    const hospitales = await Hospital.find();
    res.json(hospitales);
  } catch (error) {
    console.error('Error al obtener hospitales:', error);
    res.status(500).json({ mensaje: 'Error al obtener hospitales', error: error.message });
  }
};

// Obtener hospital por ID
exports.obtenerHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ mensaje: 'Hospital no encontrado' });
    }
    res.json(hospital);
  } catch (error) {
    console.error('Error al obtener hospital:', error);
    res.status(500).json({ mensaje: 'Error al obtener hospital', error: error.message });
  }
};

// Actualizar hospital
exports.actualizarHospital = async (req, res) => {
  try {
    const { nombre, ubicacion } = req.body;

    if (!nombre || !ubicacion) {
      return res.status(400).json({ mensaje: 'Nombre y ubicación son obligatorios' });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { nombre, ubicacion },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ mensaje: 'Hospital no encontrado' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error al actualizar hospital:', error);
    res.status(400).json({ mensaje: 'Error al actualizar hospital', error: error.message });
  }
};

// Eliminar hospital
exports.eliminarHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ mensaje: 'Hospital no encontrado' });
    }
    res.json({ mensaje: 'Hospital eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar hospital:', error);
    res.status(500).json({ mensaje: 'Error al eliminar hospital', error: error.message });
  }
};
