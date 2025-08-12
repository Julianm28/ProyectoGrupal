const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Registro (solo pruebas; en prod limitar)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.json({ msg: "Usuario creado" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ msg: "Contraseña incorrecta" });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
