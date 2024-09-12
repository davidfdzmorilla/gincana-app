// src/controllers/userController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Asegúrate de importar correctamente

// Controlador para añadir un usuario
const agregarUsuario = async (req, res) => {
  const { nombre, email, telefono, password, rol, edad, nombre_equipo, foto_perfil } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length > 0) return res.status(400).json({ message: 'El usuario ya existe.' });

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Verificar si el equipo ya existe
    db.query('SELECT * FROM teams WHERE nombre = ?', [nombre_equipo], (err, equipos) => {
      if (err) return res.status(500).json({ message: 'Error al verificar equipos.' });

      let assignedEquipoId;

      if (equipos.length > 0) {
        // Si el equipo ya existe, asignamos el equipo_id
        assignedEquipoId = equipos[0].id;
      } else {
        // Si no existe el equipo, lo creamos
        db.query('INSERT INTO teams (nombre) VALUES (?)', [nombre_equipo], (err, result) => {
          if (err) return res.status(500).json({ message: 'Error al crear el equipo.' });
          assignedEquipoId = result.insertId; // Asignar el equipo recién creado
        });
      }

      // Insertar el nuevo usuario en la tabla `users`
      db.query(
        'INSERT INTO users (nombre, email, telefono, password, rol, foto_perfil) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, email, telefono, hashedPassword, rol, foto_perfil],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Error al agregar el usuario.' });

          const userId = result.insertId; // Obtener el ID del nuevo usuario

          // Insertar el corredor (runner) asociado en la tabla `runners`
          db.query(
            'INSERT INTO runners (user_id, edad, equipo_id) VALUES (?, ?, ?)',
            [userId, edad || null, assignedEquipoId],
            (err, result) => {
              if (err) return res.status(500).json({ message: 'Error al agregar el corredor.' });

              res.status(201).json({ message: 'Usuario y corredor agregados exitosamente.', userId });
            }
          );
        }
      );
    });
  });
};

// Eliminar un usuario y sus datos relacionados
const eliminarUsuario = (req, res) => {
  const { id } = req.params;

  // Verificar si el usuario existe
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Eliminar el usuario y todos los datos relacionados
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al eliminar el usuario.' });
      res.status(200).json({ message: 'Usuario y sus datos eliminados exitosamente.' });
    });
  });
};

module.exports = { agregarUsuario, eliminarUsuario };
