const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Ver el perfil del usuario
const verPerfil = (req, res) => {
  const userId = req.user.id;  // Obtener el id del usuario autenticado desde el token

  db.query('SELECT nombre, email, telefono, foto_perfil FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'Perfil no encontrado.' });

    res.status(200).json({ perfil: result[0] });
  });
};

// Editar el perfil del usuario
const editarPerfil = async (req, res) => {
  const userId = req.user.id;  // Obtener el id del usuario autenticado desde el token
  const { nombre, email, telefono, foto_perfil, password } = req.body;

  // Si solo se envía la contraseña
  if (password && !nombre && !email && !telefono && !foto_perfil) {
    let hashedPassword;
    try {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (err) {
      return res.status(500).json({ message: 'Error al hashear la contraseña.' });
    }

    // Solo actualizar la contraseña
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error actualizando la contraseña.' });
      return res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    });
  } else {
    // Si se envían otros campos junto con la contraseña o sin ella
    let hashedPassword = null;

    // Hashear la nueva contraseña si se proporciona
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      } catch (err) {
        return res.status(500).json({ message: 'Error al hashear la contraseña.' });
      }
    }

    // Construir la consulta SQL condicional
    const query = password
      ? 'UPDATE users SET nombre = ?, email = ?, telefono = ?, foto_perfil = ?, password = ? WHERE id = ?'
      : 'UPDATE users SET nombre = ?, email = ?, telefono = ?, foto_perfil = ? WHERE id = ?';

    const values = password
      ? [nombre, email, telefono, foto_perfil, hashedPassword, userId]
      : [nombre, email, telefono, foto_perfil, userId];

    // Ejecutar la consulta para actualizar el perfil
    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: 'Error actualizando el perfil.' });
      res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    });
  }
};

module.exports = { verPerfil, editarPerfil };
