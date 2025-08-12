const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No autenticado" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token inválido" });
  }
}

function authorize(roles = []) {
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "No autenticado" });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "No autorizado" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
