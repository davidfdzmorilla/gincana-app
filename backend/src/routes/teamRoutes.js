const express = require('express');
const { obtenerEquipos, crearEquipo, seleccionarEquipo, obtenerDetallesEquipo, obtenerMejorEquipo, obtenerEquiposOrdenados } = require('../controllers/teamController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los equipos
router.get('/', verificarToken, obtenerEquipos);

// Ruta para crear un nuevo equipo (accesible por usuarios autenticados)
router.post('/create', verificarToken, crearEquipo);

// Ruta para seleccionar un equipo
router.put('/user/update', verificarToken, seleccionarEquipo);

// Ruta para obtener detalles de un equipo (corredores, vueltas, tiempo total)
router.get('/details/:equipo_id', verificarToken, obtenerDetallesEquipo);

// Ruta para obtener el mejor equipo basado en el menor tiempo total
router.get('/best', verificarToken, obtenerMejorEquipo);

// Ruta para obtener la lista de equipos ordenados de mejor a peor
router.get('/ranking', verificarToken, obtenerEquiposOrdenados);

module.exports = router;
