const Solicitud = require('../models/Solicitud');

// Crear solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const nuevaSolicitud = new Solicitud(req.body);
    await nuevaSolicitud.save();
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear solicitud', error: error.message });
  }
};

// Listar todas
exports.listarSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .populate('insumo')
      .populate('hospital');
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener solicitudes', error: error.message });
  }
};

// Cambiar estado
exports.actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estado, fechaAtencion: new Date() },
      { new: true }
    );
    if (!solicitud) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
};
