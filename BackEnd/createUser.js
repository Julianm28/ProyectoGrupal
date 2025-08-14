// BackEnd/scripts/createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../BackEnd/models/user');

(async function() {
  try {
    const uri = process.env.MONGO_URI;
    if(!uri) throw new Error('MONGO_URI no definido en .env');

    await mongoose.connect(uri);
    console.log('✅ Conectado a Mongo');

    const nombre = process.argv[2] || 'Admin Local';
    const email  = process.argv[3] || 'admin@local.com';
    const pass   = process.argv[4] || 'Admin123!';
    const role   = process.argv[5] || 'admin';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('⚠️ Ya existe un usuario con ese email:', email);
      process.exit(0);
    }

    const u = await User.create({ nombre, email, password: pass, role });
    console.log('✅ Usuario creado:');
    console.log({ id: u._id.toString(), email: u.email, role: u.role });

    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR createUser:', err);
    process.exit(1);
  }
})();
