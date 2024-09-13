const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Ver el perfil del usuario
const verPerfil = async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await db.query('SELECT nombre, email, telefono, foto_perfil FROM users WHERE id = ?', [userId]);
    if (result.length === 0) return res.status(404).json({ message: 'Perfil no encontrado.' });

    res.status(200).json({ perfil: result[0] });
  } catch (err) {
    console.error('Error al obtener el perfil:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

// Editar el perfil del usuario
const editarPerfil = async (req, res) => {
  const userId = req.user.id;  // Obtener el id del usuario autenticado desde el token
  const { nombre, email, telefono, foto_perfil, password } = req.body;

  try {
    if (password && !nombre && !email && !telefono && !foto_perfil) {
      // Actualizar solo la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
      return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } else {
      let hashedPassword = null;

      // Hashear la nueva contraseña si se proporciona
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      // Construir la consulta SQL condicional
      const query = password
        ? 'UPDATE users SET nombre = ?, email = ?, telefono = ?, foto_perfil = ?, password = ? WHERE id = ?'
        : 'UPDATE users SET nombre = ?, email = ?, telefono = ?, foto_perfil = ? WHERE id = ?';

      const values = password
        ? [nombre, email, telefono, foto_perfil, hashedPassword, userId]
        : [nombre, email, telefono, foto_perfil, userId];

      // Ejecutar la consulta para actualizar el perfil
      await db.query(query, values);
      res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    }
  } catch (err) {
    console.error('Error al actualizar el perfil:', err);
    res.status(500).json({ message: 'Error al actualizar el perfil.' });
  }
};

module.exports = { verPerfil, editarPerfil };
