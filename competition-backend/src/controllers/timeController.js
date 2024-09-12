const db = require('../config/db'); // Importa la conexión de la base de datos

// Controlador para registrar el tiempo de un corredor
const registrarTiempo = (req, res) => {
  const { runner_id, vuelta, tiempo } = req.body;

  // Verificar si el corredor existe
  db.query('SELECT * FROM runners WHERE id = ?', [runner_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'Corredor no encontrado.' });

    // Verificar si ya existe una vuelta con el mismo número para este corredor
    db.query('SELECT * FROM times WHERE runner_id = ? AND vuelta = ?', [runner_id, vuelta], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
      
      // Si ya existe una vuelta con el mismo número, devolvemos un error
      if (result.length > 0) {
        return res.status(400).json({ message: `Ya existe una vuelta con el número ${vuelta} para este corredor.` });
      }

      // Si no existe una vuelta duplicada, registramos la nueva vuelta
      db.query('INSERT INTO times (runner_id, vuelta, tiempo) VALUES (?, ?, ?)', [runner_id, vuelta, tiempo], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error al registrar el tiempo.' });
        res.status(201).json({ message: 'Tiempo registrado exitosamente.', id: result.insertId });
      });
    });
  });
};

// Controlador para borrar un tiempo
const borrarTiempo = (req, res) => {
  const { id } = req.params;

  // Verificar si el tiempo existe
  db.query('SELECT * FROM times WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'Tiempo no encontrado.' });

    // Borrar el tiempo
    db.query('DELETE FROM times WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al borrar el tiempo.' });
      res.status(200).json({ message: 'Tiempo borrado exitosamente.' });
    });
  });
};

module.exports = { registrarTiempo, borrarTiempo };
