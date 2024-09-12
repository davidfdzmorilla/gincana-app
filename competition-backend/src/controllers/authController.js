const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Controlador para login
const login = (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos' });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = result[0];

    // Verificar la contraseña
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

      // Crear un JWT
      const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.json({ token });
    });
  });
};

module.exports = { login };
