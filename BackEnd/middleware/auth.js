const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ msg: 'No autorizado' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
}

function permit(...roles) {
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({ msg: 'No autorizado' });
    if(!roles.includes(req.user.role)) return res.status(403).json({ msg: 'Acceso denegado' });
    next();
  };
}

module.exports = { auth, permit };
