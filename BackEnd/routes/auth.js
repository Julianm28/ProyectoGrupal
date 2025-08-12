const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/login', async (req,res) => {
  const {email, password} = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({msg:'Credenciales inválidas'});
  const ok = await user.comparePassword(password);
  if(!ok) return res.status(401).json({msg:'Credenciales inválidas'});
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user._id, nombre: user.nombre, role: user.role } });
});

module.exports = router;
