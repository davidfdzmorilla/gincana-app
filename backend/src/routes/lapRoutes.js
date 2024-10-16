const express = require('express');
const {
  obtenerVueltas,
  eliminarVuelta,
  obtenerMejorTiempoVueltas
} = require('../controllers/lapController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todas las vueltas de un corredor, accesible solo para administradores
router.get('/corredor/:runner_id', verificarAdmin, obtenerVueltas);
// Ruta para coger el mejor tiempo por vuelta
router.get('/ranking-mejor-vuelta', obtenerMejorTiempoVueltas);
// Eliminar una vuelta específica, accesible solo para administradores
router.delete('/delete/:lap', verificarAdmin, eliminarVuelta);

module.exports = router;
