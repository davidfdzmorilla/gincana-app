const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { registrarAuditoria } = require("../utils/auditLogger");

// Controlador para añadir un usuario
const agregarUsuario = async (req, res) => {
  const { nombre, email, telefono, password, rol, edad, equipo, foto_perfil } =
    req.body;
  const nombre_equipo = equipo;
  const adminUserId = req.user.id;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Verificar si el equipo ya existe, si no, crearlo
    const [equipos] = await db.query("SELECT * FROM teams WHERE nombre = ?", [
      nombre_equipo,
    ]);
    let assignedEquipoId;
    if (equipos.length > 0) {
      assignedEquipoId = equipos[0].id;
    } else {
      const [equipoResult] = await db.query(
        "INSERT INTO teams (nombre) VALUES (?)",
        [nombre_equipo]
      );
      assignedEquipoId = equipoResult.insertId;
    }

    // Insertar el nuevo usuario en la tabla `users`
    const [userResult] = await db.query(
      "INSERT INTO users (nombre, email, telefono, password, rol, foto_perfil) VALUES (?, ?, ?, ?, ?, ?)",
      [
        nombre,
        email,
        telefono,
        hashedPassword,
        rol,
        "/uploads/1726651644630-admin.webp",
      ]
    );
    const userId = userResult.insertId;

    // Insertar el corredor asociado en la tabla `runners`
    await db.query(
      "INSERT INTO runners (user_id, edad, equipo_id) VALUES (?, ?, ?)",
      [userId, edad || null, assignedEquipoId]
    );

    // Registrar evento de auditoría
    await registrarAuditoria(adminUserId, "CREATE", "users", userId);

    res
      .status(201)
      .json({ message: "Usuario y corredor agregados exitosamente.", userId });
  } catch (err) {
    console.error("Error al agregar el usuario:", err);
    res.status(500).json({ message: "Error en la base de datos." });
  }
};

// Controlador para eliminar un usuario y sus datos relacionados
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const [userResult] = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    if (userResult.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Eliminar el usuario y todos los datos relacionados
    await db.query("DELETE FROM users WHERE id = ?", [id]);

    // Registrar evento de auditoría
    await registrarAuditoria(req.user.id, "DELETE", "users", id);

    res
      .status(200)
      .json({ message: "Usuario y sus datos eliminados exitosamente." });
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ message: "Error en la base de datos." });
  }
};

module.exports = { agregarUsuario, eliminarUsuario };
