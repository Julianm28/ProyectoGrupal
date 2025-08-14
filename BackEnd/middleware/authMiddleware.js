// BackEnd/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
