const db = require('../config/db');

// Obtener todos los equipos
const obtenerEquipos = (req, res) => {
  db.query('SELECT * FROM teams', (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos.' });
    }

    res.status(200).json({ equipos: result });
  });
};

// Crear un nuevo equipo
const crearEquipo = (req, res) => {
  const { nombre_equipo, foto_perfil } = req.body;

  console.log(req.body);

  // Verificar si ya existe un equipo con ese nombre
  db.query('SELECT * FROM teams WHERE nombre = ?', [nombre_equipo], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'El equipo ya existe.' });
    }

    // Insertar el nuevo equipo en la tabla `equipos`
    db.query('INSERT INTO teams (nombre, foto_perfil) VALUES (?, ?)', [nombre_equipo, foto_perfil], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al crear el equipo.' });

      res.status(201).json({ message: 'Equipo creado exitosamente.', equipo_id: result.insertId });
    });
  });
};

// Seleccionar un equipo
const seleccionarEquipo = (req, res) => {
  const { equipo_id } = req.body;
  const userId = req.user.id;  // Obtener el ID del usuario autenticado

  // Actualizar el equipo del corredor en la tabla runners
  db.query('UPDATE runners SET equipo_id = ? WHERE user_id = ?', [equipo_id, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al seleccionar el equipo.' });

    res.status(200).json({ message: 'Equipo seleccionado exitosamente.' });
  });
};

// Obtener detalles de un equipo (corredores, vueltas, tiempo total)
const obtenerDetallesEquipo = (req, res) => {
  const { equipo_id } = req.params;

  // Query para obtener los corredores y el tiempo total por equipo
  const query = `
    SELECT 
      teams.id AS equipo_id, teams.nombre AS equipo_nombre,
      SUM(times.tiempo) AS tiempo_total, COUNT(times.id) AS total_vueltas
    FROM teams
    INNER JOIN runners ON runners.equipo_id = equipos.id
    LEFT JOIN times ON runners.id = times.runner_id
    GROUP BY teams.id
    ORDER BY tiempo_total ASC
    LIMIT 1
  `;

  db.query(query, [equipo_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron detalles para este equipo.' });
    }

    res.status(200).json({ equipo: result });
  });
};

// Obtener el mejor equipo basado en el menor tiempo total
const obtenerMejorEquipo = (req, res) => {
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

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos con vueltas registradas.' });
    }

    res.status(200).json({ mejor_equipo: result[0] });
  });
};

const obtenerEquiposOrdenados = (req, res) => {
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

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron equipos con vueltas registradas.' });
    }

    res.status(200).json({ equipos: result });
  });
};

module.exports = { obtenerEquipos, crearEquipo, seleccionarEquipo, obtenerDetallesEquipo, obtenerMejorEquipo, obtenerEquiposOrdenados };
