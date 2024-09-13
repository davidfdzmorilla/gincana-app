const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Controlador para login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario existe
  const [result] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

  const user = result[0];

  // Verificar la contraseña
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

  // Crear y devolver user y token
  const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, token });
};

module.exports = { login };
