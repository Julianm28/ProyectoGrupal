require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user'); // Ajusta la ruta si está en otro lado

async function updatePassword(email, newPassword) {
  try {
    // Conexión a Mongo
    await mongoose.connect(process.env.MONGO_URI);

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Usuario con email ${email} no encontrado`);
      return;
    }

    // Cambiar la contraseña
    user.password = newPassword; // Se encripta automáticamente por el pre('save')
    await user.save();

    console.log(`Contraseña actualizada para ${email}`);
    process.exit();
  } catch (err) {
    console.error('Error actualizando contraseña:', err);
    process.exit(1);
  }
}

// Cambia el email y la contraseña aquí ↓
updatePassword('admin@correo.com', 'MiNuevaClave123');
