const db = require('../config/db'); // Importa la conexión de la base de datos

// Controlador para registrar el tiempo de un corredor
const registrarTiempo = (req, res) => {
  const { runner_id, vuelta, tiempo } = req.body;

  // Verificar si el corredor existe
  db.query('SELECT * FROM runners WHERE id = ?', [runner_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'Corredor no encontrado.' });

    // Insertar el tiempo en la tabla 'times'
    db.query(
      'INSERT INTO times (runner_id, vuelta, tiempo) VALUES (?, ?, ?)',
      [runner_id, vuelta, tiempo],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar el tiempo.' });
        res.status(201).json({ message: 'Tiempo registrado exitosamente.' });
      }
    );
  });
};

module.exports = { registrarTiempo };
