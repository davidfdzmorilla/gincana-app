const jwt = require('jsonwebtoken');

// Middleware para verificar el token y rol de administrador
const verificarAdmin = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el usuario es administrador
    if (verified.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos de administrador.' });
    }

    // Si es administrador, continuar
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = { verificarAdmin };
