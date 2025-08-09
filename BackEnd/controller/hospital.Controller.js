const Hospital = require('../models/Hospital');

// Crear hospital
exports.crearHospital = async (req, res) => {
  try {
    const nuevoHospital = new Hospital(req.body);
    await nuevoHospital.save();
    res.status(201).json(nuevoHospital);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear hospital', error: error.message });
  }
};

// Listar hospitales
exports.listarHospitales = async (req, res) => {
  try {
    const hospitales = await Hospital.find();
    res.json(hospitales);
  } catch (error) {
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
    res.status(500).json({ mensaje: 'Error al obtener hospital', error: error.message });
  }
};

// Actualizar hospital
exports.actualizarHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hospital) {
      return res.status(404).json({ mensaje: 'Hospital no encontrado' });
    }
    res.json(hospital);
  } catch (error) {
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
    res.status(500).json({ mensaje: 'Error al eliminar hospital', error: error.message });
  }
};
