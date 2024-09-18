const bcrypt = require("bcryptjs");
const db = require("../config/db");

// Ver el perfil del usuario
const verPerfil = async (req, res) => {
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "SELECT nombre, email, telefono, foto_perfil FROM users WHERE id = ?",
      [userId]
    );
    if (result.length === 0)
      return res.status(404).json({ message: "Perfil no encontrado." });

    res.status(200).json({ perfil: result[0] });
  } catch (err) {
    console.error("Error al obtener el perfil:", err);
    res.status(500).json({ message: "Error en la base de datos." });
  }
};

// Editar el perfil del usuario
const editarPerfil = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado." });
  }

  const userId = req.user.id;
  const { nombre, email, telefono, password } = req.body;
  let foto_perfil = null;

  // Manejar la imagen de perfil
  if (req.file) {
    foto_perfil = `/uploads/${req.file.filename}`;
  }

  console.log("Datos del perfil:", { nombre, email, telefono, foto_perfil });

  try {
    if (!nombre || !email) {
      return res
        .status(400)
        .json({ message: "El nombre y el email son obligatorios." });
    }

    let hashedPassword = null;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    let query = "UPDATE users SET nombre = ?, email = ?, telefono = ?";
    const values = [nombre, email, telefono];

    if (foto_perfil) {
      query += ", foto_perfil = ?";
      values.push(foto_perfil);
    }

    if (hashedPassword) {
      query += ", password = ?";
      values.push(hashedPassword);
    }

    query += " WHERE id = ?";
    values.push(userId);

    await db.query(query, values);

    const newDataUser = await db.query(
      "SELECT nombre, email, rol, telefono, foto_perfil FROM users WHERE id = ?",
      [userId]
    );
    res.status(200).json({
      message: "Perfil actualizado exitosamente.",
      user: { ...newDataUser[0][0] },
    });
  } catch (err) {
    console.error("Error al actualizar el perfil:", err);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
};

module.exports = { verPerfil, editarPerfil };
