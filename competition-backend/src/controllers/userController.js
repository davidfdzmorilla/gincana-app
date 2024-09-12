// src/controllers/userController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Asegúrate de importar correctamente

// Controlador para añadir un usuario
const agregarUsuario = async (req, res) => {
  const { nombre, email, telefono, password, rol } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length > 0) return res.status(400).json({ message: 'El usuario ya existe.' });

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    db.query(
      'INSERT INTO users (nombre, email, telefono, password, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono, hashedPassword, rol],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
        res.status(201).json({ message: 'Usuario agregado exitosamente.', id: result.insertId });
      }
    );
  });
};

module.exports = { agregarUsuario };
