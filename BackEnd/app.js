require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const stockAlertJob = require("./jobs/stockAlertJobs");

// rutas
const authRoutes = require("./routes/auth");
const hospitalRoutes = require("./routes/hospital");
const categoriaRoutes = require("./routes/categoriaRoutes");
const insumoRoutes = require("./routes/Insumo.routes");
const solicitudRoutes = require("./routes/solicitud");
const entregaRoutes = require("./routes/entrega");
const analyticsRoutes = require("./routes/analytics");
const mapaRoutes = require("./routes/mapa");
const reportesRoutes = require("./routes/reportes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// montar rutas
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/insumos", insumoRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/entregas", entregaRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/mapa", mapaRoutes);
app.use("/api/reportes", reportesRoutes);

// inicio servidor
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  stockAlertJob.start();
}).catch(err => {
  console.error("Error al conectar DB:", err);
});
