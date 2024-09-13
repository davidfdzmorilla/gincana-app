const db = require('../config/db');
const { registrarAuditoria } = require('../utils/auditLogger');

// Obtener todos los equipos
const obtenerEquipos = async (req, res) => {
  try {
    const [equipos] = await db.query('SELECT * FROM teams');
    res.status(200).json(equipos);
  } catch (err) {
    console.error('Error al obtener equipos:', err);
    res.status(500).json({ message: 'Error al obtener equipos.' });
  }
};

// Crear un nuevo equipo
const crearEquipo = async (req, res) => {
  const { nombre_equipo, foto_perfil } = req.body;
  const adminUserId = req.user.id; // Obtener el ID del usuario autenticado

  try {
    const [equipoExistente] = await db.query('SELECT * FROM teams WHERE nombre = ?', [nombre_equipo]);

    if (equipoExistente.length > 0) {
      return res.status(400).json({ message: 'El equipo ya existe.' });
    }

    const [result] = await db.query('INSERT INTO teams (nombre, foto_perfil) VALUES (?, ?)', [nombre_equipo, foto_perfil]);

    // Registrar evento de auditoría
    await registrarAuditoria(adminUserId, 'CREATE', 'teams', result.insertId);

    res.status(201).json({ message: 'Equipo creado exitosamente.', equipo_id: result.insertId });
  } catch (err) {
    console.error('Error al crear equipo:', err);
    res.status(500).json({ message: 'Error al crear el equipo.' });
  }
};

// Seleccionar un equipo
const seleccionarEquipo = async (req, res) => {
  const { equipo_id } = req.body;
  const userId = req.user.id;  // Obtener el ID del usuario autenticado

  try {
    await db.query('UPDATE runners SET equipo_id = ? WHERE user_id = ?', [equipo_id, userId]);

    // Registrar evento de auditoría
    await registrarAuditoria(userId, 'UPDATE', 'runners', userId);

    res.status(200).json({ message: 'Equipo seleccionado exitosamente.' });
  } catch (err) {
    console.error('Error al seleccionar equipo:', err);
    res.status(500).json({ message: 'Error al seleccionar el equipo.' });
  }
};

// Obtener detalles de un equipo (corredores, vueltas, tiempo total)
const obtenerDetallesEquipo = async (req, res) => {
  const { equipo_id } = req.params;

  const query = `
    SELECT 
      teams.id AS equipo_id, teams.nombre AS equipo_nombre,
      SUM(times.tiempo) AS tiempo_total, COUNT(times.id) AS total_vueltas
    FROM teams
    INNER JOIN runners ON runners.equipo_id = teams.id
    LEFT JOIN times ON runners.id = times.runner_id
    WHERE teams.id = ?
    GROUP BY teams.id
  `;

  try {
    const [result] = await db.query(query, [equipo_id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron detalles para este equipo.' });
    }

    res.status(200).json({ equipo: result[0] });
  } catch (err) {
    console.error('Error al obtener detalles del equipo:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

// Obtener el mejor equipo
const obtenerMejorEquipo = async (req, res) => {
  const query = `
    SELECT 
      teams.id AS equipo_id, teams.nombre AS equipo_nombre,
      COALESCE(SUM(times.tiempo), 0) AS tiempo_total, 
      COUNT(times.id) AS total_vueltas,
      GROUP_CONCAT(DISTINCT users.nombre SEPARATOR ', ') AS nombres_corredores
    FROM teams
    LEFT JOIN runners ON runners.equipo_id = teams.id
    LEFT JOIN times ON runners.id = times.runner_id
    LEFT JOIN users ON users.id = runners.user_id
    GROUP BY teams.id
    ORDER BY total_vueltas DESC, tiempo_total ASC
    LIMIT 1;
  `;

  try {
    const [result] = await db.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos con vueltas registradas.' });
    }

    res.status(200).json({ mejor_equipo: result[0] });
  } catch (err) {
    console.error('Error al obtener el mejor equipo:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

// Obtener equipos ordenados
const obtenerEquiposOrdenados = async (req, res) => {
  const query = `
    SELECT 
      teams.id AS equipo_id, teams.nombre AS equipo_nombre,
      COALESCE(SUM(times.tiempo), 0) AS tiempo_total, 
      COUNT(times.id) AS total_vueltas,
      GROUP_CONCAT(DISTINCT users.nombre SEPARATOR ', ') AS nombres_corredores
    FROM teams
    LEFT JOIN runners ON runners.equipo_id = teams.id
    LEFT JOIN times ON runners.id = times.runner_id
    LEFT JOIN users ON users.id = runners.user_id
    GROUP BY teams.id
    ORDER BY total_vueltas DESC, tiempo_total ASC;
  `;

  try {
    const [result] = await db.query(query);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos con vueltas registradas.' });
    }

    res.status(200).json({ equipos: result });
  } catch (err) {
    console.error('Error al obtener equipos ordenados:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

module.exports = { obtenerEquipos, crearEquipo, seleccionarEquipo, obtenerDetallesEquipo, obtenerMejorEquipo, obtenerEquiposOrdenados };
