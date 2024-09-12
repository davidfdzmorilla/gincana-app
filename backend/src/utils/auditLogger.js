const db = require('../config/db'); // Conexión a la base de datos

// Función para registrar eventos de auditoría
const registrarAuditoria = (userId, action, entity, entityId) => {
  const query = 'INSERT INTO audit_logs (user_id, action, entity, entity_id) VALUES (?, ?, ?, ?)';
  db.query(query, [userId, action, entity, entityId], (err, result) => {
    if (err) console.log('Error al registrar auditoría:', err);
  });
};

module.exports = { registrarAuditoria };
