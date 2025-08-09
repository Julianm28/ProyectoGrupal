const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Conexión a la base de datos
const connectDB = require('./config/db');
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/insumos', require('./routes/Insumo.routes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
