const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Conexión a la base de datos
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // <-- esto debe ir ANTES de las rutas

// Rutas
app.use('/api/hospitales', require('./routes/hospital'));
app.use('/api/insumos', require('./routes/Insumo.routes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/solicitudes', require('./routes/solicitud'));
app.use('/api/entregas', require('./routes/entrega'));


// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});

