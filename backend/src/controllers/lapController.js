const db = require('../config/db');
const { registrarAuditoria } = require('../utils/auditLogger');

// Obtener todas las vueltas de un corredor específico
const obtenerVueltas = async (req, res) => {
  try {
    const { runner_id } = req.params;
    const adminUserId = req.user.id;

    // Realizar la consulta para obtener las vueltas
    const [result] = await db.query('SELECT * FROM times WHERE runner_id = ?', [runner_id]);

    // Si no se encontraron vueltas, devolver 0 vueltas
    if (!result.length) {
      // Registrar evento de auditoría
      registrarAuditoria(adminUserId, 'READ', 'times', runner_id);
      return res.status(200).json({ vueltas: [] });
    }

    // Registrar evento de auditoría
    registrarAuditoria(adminUserId, 'READ', 'times', runner_id);

    res.status(200).json({ vueltas: result });
  } catch (err) {
    console.error('Error al obtener vueltas:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

// Eliminar una vuelta específica
const eliminarVuelta = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.id;
    console.log('Eliminando vuelta:', id);

    // Realizar la consulta para eliminar la vuelta
    const [result] = await db.query('DELETE FROM times WHERE id = ?', [id]);

    // Si no se encontró la vuelta, devolver error
    if (result.affectedRows === 0) {
      console.error('Vuelta no encontrada:', id);
      return res.status(404).json({ message: 'Vuelta no encontrada.' });
    }

    // Registrar evento de auditoría
    registrarAuditoria(adminUserId, 'DELETE', 'times', id);

    res.status(200).json({ message: 'Vuelta eliminada correctamente.' });
  } catch (err) {
    console.error('Error al eliminar vuelta:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

// Coger ranking mejores tiempos por vuelta
const obtenerMejorTiempoVueltas = async (req, res) => {
  try {
    // Realizar la consulta para obtener el ranking de mejores tiempos por vuelta
    const [result] = await db.query('SELECT runner_id, MIN(tiempo) AS mejor_tiempo FROM times GROUP BY runner_id');
    // Ordenar los resultados por tiempo
    result.sort((a, b) => a.mejor_tiempo - b.mejor_tiempo);
    // Coger los datos del usuario runner_id = id ruuners, en el runner user_id = id users
    for (let i = 0; i < result.length; i++) {
      const [runner] = await db.query('SELECT * FROM runners WHERE id = ?', [result[i].runner_id]);
      const [user] = await db.query('SELECT * FROM users WHERE id = ?', [runner[0].user_id]);
      result[i].nombre = user[0].nombre;
      result[i].foto_perfil = user[0].foto_perfil;
    }

    res.status(200).json({ corredores: result });
  } catch (err) {
    console.error('Error al obtener ranking de mejores tiempos por vuelta:', err);
    res.status(500).json({ message: 'Error en la base de datos.' });
  }
};

module.exports = {
  obtenerVueltas,
  eliminarVuelta,
  obtenerMejorTiempoVueltas,
};
