// BackEnd/routes/auth.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// POST /api/auth/login
router.post('/login', async (req,res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({msg:'Credenciales inválidas'});
    const ok = await user.comparePassword(password);
    if(!ok) return res.status(401).json({msg:'Credenciales inválidas'});

    const token = jwt.sign(
      { id: user._id, role: user.role, nombre: user.nombre, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: { id: user._id, nombre: user.nombre, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Error interno' });
  }
});

// POST /api/auth/register  <-- nuevo (para crear usuarios)
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email y password son requeridos' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ msg: 'Ya existe un usuario con ese email' });
    }

    const user = new User({
      nombre: nombre || '',
      email,
      password,          // se hashea en el pre-save del modelo
      role: role || 'medico'
    });
    await user.save();

    return res.status(201).json({
      msg: 'Usuario creado',
      user: { id: user._id, nombre: user.nombre, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ msg: 'Error creando usuario' });
  }
});

// GET /api/auth/me  <-- útil para pruebas de token
const { authenticate } = require('../middleware/authMiddleware');
router.get('/me', authenticate, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select('-password');
    if (!me) return res.status(404).json({ msg: 'Usuario no encontrado' });
    return res.json(me);
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ msg: 'Error interno' });
  }
});

module.exports = router;
