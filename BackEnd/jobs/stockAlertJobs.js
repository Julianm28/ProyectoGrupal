const cron = require("node-cron");
const Insumo = require("../models/Insumo");

const stockAlertJob = cron.schedule("0 * * * *", async () => { // cada hora en minuto 0
  try {
    console.log("[Job] Revisión stock mínimo");
    const insumos = await Insumo.find({});
    insumos.forEach(i => {
      if (i.currentStock <= i.minStock) {
        console.log(`[ALERTA] Insumo "${i.name}" stock=${i.currentStock} min=${i.minStock}`);
        // Aquí podrías guardar en una colección "alerts" o enviar notificación
      }
    });
  } catch (err) {
    console.error("Error job:", err);
  }
}, { scheduled: false });

module.exports = stockAlertJob;
