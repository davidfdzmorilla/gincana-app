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

module.exports = { obtenerCorredores };
