const db = require('../config/db');
const { registrarAuditoria } = require('../utils/auditLogger');
const { emitirActualizacionTiempos } = require('../utils/socket');

// Controlador para registrar el tiempo de un corredor
const registrarTiempo = async (req, res) => {
  const { runner_id, vuelta, tiempo } = req.body;
  const adminUserId = req.user.id; // Obtener el ID del usuario autenticado

  try {
    // Verificar si el corredor existe
    const [runnerResult] = await db.query('SELECT * FROM runners WHERE id = ?', [runner_id]);
    if (runnerResult.length === 0) {
      return res.status(404).json({ message: 'Corredor no encontrado.' });
    }

    // Verificar si ya existe una vuelta con el mismo número para este corredor
    const [timeResult] = await db.query('SELECT * FROM times WHERE runner_id = ? AND vuelta = ?', [runner_id, vuelta]);
    if (timeResult.length > 0) {
      return res.status(400).json({ message: `Ya existe una vuelta con el número ${vuelta} para este corredor.` });
    }

    // Si no existe una vuelta duplicada, registramos la nueva vuelta
    const [insertResult] = await db.query('INSERT INTO times (runner_id, vuelta, tiempo) VALUES (?, ?, ?)', [runner_id, vuelta, tiempo]);

    // Emitir la actualización de tiempos a través de WebSocket
    emitirActualizacionTiempos({ runner_id, vuelta, tiempo });

    // Registrar evento de auditoría
    await registrarAuditoria(adminUserId, 'CREATE', 'times', insertResult.insertId);

    res.status(201).json({ message: 'Tiempo registrado exitosamente.', id: insertResult.insertId });
  } catch (err) {
    console.error('Error al registrar el tiempo:', err);
    res.status(500).json({ message: 'Error al registrar el tiempo.' });
  }
};

// Controlador para borrar un tiempo
const borrarTiempo = async (req, res) => {
  const { id } = req.params;
  const adminUserId = req.user.id; // Obtener el ID del usuario autenticado

  try {
    // Verificar si el tiempo existe
    const [timeResult] = await db.query('SELECT * FROM times WHERE id = ?', [id]);
    if (timeResult.length === 0) {
      return res.status(404).json({ message: 'Tiempo no encontrado.' });
    }

    // Borrar el tiempo
    await db.query('DELETE FROM times WHERE id = ?', [id]);

    // Registrar evento de auditoría
    await registrarAuditoria(adminUserId, 'DELETE', 'times', id);

    res.status(200).json({ message: 'Tiempo borrado exitosamente.' });
  } catch (err) {
    console.error('Error al borrar el tiempo:', err);
    res.status(500).json({ message: 'Error al borrar el tiempo.' });
  }
};

module.exports = { registrarTiempo, borrarTiempo };
