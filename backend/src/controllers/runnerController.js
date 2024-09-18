const db = require("../config/db");

// Controlador para obtener todos los corredores
const obtenerCorredores = async (req, res) => {
  const query = `
    SELECT runners.id AS runner_id, runners.edad, runners.equipo_id, 
           users.id AS user_id, users.nombre, users.email, users.telefono, users.foto_perfil
    FROM runners
    INNER JOIN users ON runners.user_id = users.id
  `;

  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron corredores." });
    }

    res.status(200).json({ corredores: result });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    return res.status(500).json({ message: "Error en la base de datos." });
  }
};

// Controlador para obtener el mejor corredor
const obtenerMejorCorredor = async (req, res) => {
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

  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron corredores con vueltas registradas.",
      });
    }

    res.status(200).json({ mejor_corredor: result[0] });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    return res.status(500).json({ message: "Error en la base de datos." });
  }
};

// Controlador para obtener el ranking de corredores
const obtenerRankingCorredores = async (req, res) => {
  const query = `
        SELECT 
        runners.id AS runner_id, 
        users.nombre AS corredor_nombre,
        users.foto_perfil,  -- Añadimos la columna foto_perfil
        COALESCE(SUM(times.tiempo), 0) AS tiempo_total, 
        COUNT(times.id) AS total_vueltas,
        teams.nombre AS equipo_nombre
    FROM runners
    LEFT JOIN users ON runners.user_id = users.id
    LEFT JOIN times ON runners.id = times.runner_id
    LEFT JOIN teams ON runners.equipo_id = teams.id
    GROUP BY runners.id, users.foto_perfil  -- Añadir users.foto_perfil al GROUP BY
    ORDER BY total_vueltas DESC, tiempo_total ASC;
  `;

  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(200).json({
        message: "No se encontraron corredores con vueltas registradas.",
        corredores: [],
      });
    }

    // Si el tiempo es 0 no devolver el corredor
    const filteredResult = result.filter(
      (corredor) => corredor.tiempo_total > 0
    );

    res.status(200).json({ corredores: filteredResult });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    return res.status(500).json({ message: "Error en la base de datos." });
  }
};

module.exports = {
  obtenerCorredores,
  obtenerMejorCorredor,
  obtenerRankingCorredores,
};
