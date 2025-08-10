const Solicitud = require("../models/Solicitud");

exports.crearSolicitud = async (req, res) => {
    try {
        const { hospital, descripcion } = req.body;
        const nuevaSolicitud = new Solicitud({ hospital, descripcion });
        await nuevaSolicitud.save();
        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear solicitud", error: error.message });
    }
};

exports.obtenerSolicitudes = async (req, res) => {
    try {
        const solicitudes = await Solicitud.find()
            .populate("hospital", "nombre codigo direccion tipo");
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener solicitudes", error: error.message });
    }
};

exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["Pendiente", "Aprobada", "Rechazada"].includes(estado)) {
            return res.status(400).json({ mensaje: "Estado inválido" });
        }

        const solicitud = await Solicitud.findByIdAndUpdate(id, { estado }, { new: true });
        if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar solicitud", error: error.message });
    }
};
