const db = require('../config/db');
const { registrarAuditoria } = require('../utils/auditLogger');

// Obtener todas las vueltas de un corredor específico
const obtenerVueltas = (req, res) => {
  const { runner_id } = req.params;
  const adminUserId = req.user.id; // Obtener el ID del usuario autenticado

  db.query('SELECT * FROM times WHERE runner_id = ?', [runner_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos.' });
    if (result.length === 0) return res.status(404).json({ message: 'No se encontraron vueltas para este corredor.' });

    // Registrar evento de auditoría
    registrarAuditoria(adminUserId, 'READ', 'times', runner_id);

    res.status(200).json({ vueltas: result });
  });
};

module.exports = { obtenerVueltas };