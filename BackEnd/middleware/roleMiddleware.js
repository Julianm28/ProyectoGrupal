module.exports = function (rolesPermitidos) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ mensaje: "No autenticado" });
    }
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }
    next();
  };
};