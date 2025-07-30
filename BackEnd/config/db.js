const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 MongoDB conectado');
  } catch (err) {
    console.error('🔴 Error en conexión MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
