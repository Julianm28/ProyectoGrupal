// BackEnd/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const stockAlertJob = require("./jobs/stockAlertJobs");

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      },
    },
  })
);
app.use(morgan("dev"));

// Frontend
const frontEndPath = path.join(__dirname, "..", "FrontEnd");
const loginPath = path.join(frontEndPath, "login.html");
console.log("Sirviendo login desde:", loginPath);

app.get("/", (req, res) => res.sendFile(loginPath));
app.use(express.static(frontEndPath));

// API
app.use("/api/auth", authRoutes); // login/registro sin autenticación

// Protegidas por rol
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/categorias", authenticate, authorize("admin"), categoriaRoutes);

// Insumos: incluye /public (sin token) y protegidas
app.use("/api/insumos", insumoRoutes);

app.use("/api/solicitudes", authenticate, authorize("medico", "bodega"), solicitudRoutes);
app.use("/api/entregas", authenticate, authorize("bodega"), entregaRoutes);
app.use("/api/analytics", authenticate, authorize("admin"), analyticsRoutes);
app.use("/api/mapa", authenticate, authorize("admin"), mapaRoutes);
app.use("/api/alertas", authenticate, authorize("admin"), alertasRoutes);
app.use("/api/reportes", authenticate, authorize("admin", "bodega"), reportesRoutes);
app.use("/api/setup", setupRoutes);

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));
    if (stockAlertJob?.start) stockAlertJob.start();
  })
  .catch(err => {
    console.error("❌ Error al conectar DB:", err);
  });
