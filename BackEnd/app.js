require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const stockAlertJob = require("./jobs/stockAlertJobs");

// Middlewares
const { authenticate, authorize } = require("./middleware/authMiddleware");

// Rutas API
const authRoutes = require("./routes/auth");
const hospitalRoutes = require("./routes/hospital");
const categoriaRoutes = require("./routes/categoriaRoutes");
const insumoRoutes = require("./routes/Insumo.routes");
const solicitudRoutes = require("./routes/solicitud");
const entregaRoutes = require("./routes/entrega");
const analyticsRoutes = require("./routes/analytics");
const mapaRoutes = require("./routes/mapa");
const alertasRoutes = require("./routes/alertas");
const reportesRoutes = require("./routes/reportes");
const setupRoutes = require("./routes/setup");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// Servir frontend
app.use(express.static(path.join(__dirname, "FrontEnd")));

// Ruta inicial → login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "FrontEnd", "login.html"));
});

// Montar rutas API
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", authenticate, authorize("admin"), hospitalRoutes);
app.use("/api/categorias", authenticate, authorize("admin"), categoriaRoutes);
app.use("/api/insumos", authenticate, authorize("admin", "bodega"), insumoRoutes);
app.use("/api/solicitudes", authenticate, authorize("medico", "bodega"), solicitudRoutes);
app.use("/api/entregas", authenticate, authorize("bodega"), entregaRoutes);
app.use("/api/analytics", authenticate, authorize("admin"), analyticsRoutes);
app.use("/api/mapa", authenticate, authorize("admin"), mapaRoutes);
app.use("/api/alertas", authenticate, authorize("admin"), alertasRoutes);
app.use("/api/reportes", authenticate, authorize("admin", "bodega"), reportesRoutes);
app.use("/api/setup", setupRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    stockAlertJob.start();
  })
  .catch(err => {
    console.error("Error al conectar DB:", err);
  });
