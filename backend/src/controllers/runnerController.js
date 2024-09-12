const db = require('../config/db');

// Controlador para obtener todos los corredores
const obtenerCorredores = (req, res) => {
  const query = `
    SELECT runners.id AS runner_id, runners.edad, runners.equipo_id, 
           users.id AS user_id, users.nombre, users.email, users.telefono, users.foto_perfil
    FROM runners
    INNER JOIN users ON runners.user_id = users.id
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron corredores.' });
    }

    res.status(200).json({ corredores: result });
  });
};

const obtenerMejorCorredor = (req, res) => {
  const query = `
    SELECT 
      runners.id AS runner_id, users.nombre AS corredor_nombre,
      COALESCE(SUM(times.tiempo), 0) AS tiempo_total, 
      COUNT(times.id) AS total_vueltas,
      teams.nombre AS equipo_nombre
    FROM runners
    LEFT JOIN users ON runners.user_id = users.id
    LEFT JOIN times ON runners.id = times.runner_id
    LEFT JOIN teams ON runners.equipo_id = teams.id
    GROUP BY runners.id
    ORDER BY total_vueltas DESC, tiempo_total ASC
    LIMIT 1;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron corredores con vueltas registradas.' });
    }

    res.status(200).json({ mejor_corredor: result[0] });
  });
};

const obtenerRankingCorredores = (req, res) => {
  const query = `
    SELECT 
      runners.id AS runner_id, users.nombre AS corredor_nombre,
      COALESCE(SUM(times.tiempo), 0) AS tiempo_total, 
      COUNT(times.id) AS total_vueltas,
      teams.nombre AS equipo_nombre
    FROM runners
    LEFT JOIN users ON runners.user_id = users.id
    LEFT JOIN times ON runners.id = times.runner_id
    LEFT JOIN teams ON runners.equipo_id = teams.id
    GROUP BY runners.id
    ORDER BY total_vueltas DESC, tiempo_total ASC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en la base de datos.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron corredores con vueltas registradas.' });
    }

    res.status(200).json({ corredores: result });
  });
};



module.exports = { obtenerCorredores, obtenerMejorCorredor, obtenerRankingCorredores };
