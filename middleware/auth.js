const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  const token  = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado' });
  }
};
