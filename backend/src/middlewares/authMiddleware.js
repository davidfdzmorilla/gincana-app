const jwt = require('jsonwebtoken');

// Middleware para verificar el token y rol de administrador
const verificarAdmin = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  // Verificar si la cabecera Authorization está presente
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Verificar si el token sigue el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
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

const verificarToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Guardar la información del usuario autenticado
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = { verificarAdmin, verificarToken };
