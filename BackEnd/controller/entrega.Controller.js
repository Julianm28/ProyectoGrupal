const Entrega = require('../models/Entrega');
const Solicitud = require('../models/Solicitud');
const Insumo = require('../models/Insumo');

exports.crearEntrega = async (req, res) => {
  try {
    const { solicitudId, hospitalId, insumos, entregadoPor } = req.body;

    //  Validar que la solicitud exista
    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    }

    //  Restar inventario
    for (const item of insumos) {
      const insumo = await Insumo.findById(item.insumoId);
      if (!insumo) {
        return res.status(404).json({ mensaje: `Insumo no encontrado: ${item.insumoId}` });
      }
      if (insumo.cantidad < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para: ${insumo.nombre}` });
      }

      insumo.cantidad -= item.cantidad;
      await insumo.save();
    }

    //  Crear la entrega
    const nuevaEntrega = new Entrega({
      solicitudId,
      hospitalId,
      insumos,
      entregadoPor
    });
    await nuevaEntrega.save();

    //  Actualizar estado de la solicitud
    solicitud.estado = 'Entregada';
    await solicitud.save();

    res.status(201).json({
      mensaje: 'Entrega registrada y stock actualizado exitosamente',
      entrega: nuevaEntrega
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar entrega',
      error: error.message
    });
  }
};

exports.obtenerEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.find()
      .populate('solicitudId')
      .populate('hospitalId')
      .populate('insumos.insumoId');

    res.json(entregas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener entregas',
      error: error.message
    });
  }
};
