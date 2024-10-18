const express = require('express');
const { obtenerCorredores, obtenerMejorCorredor, obtenerRankingCorredores, obtenerRankingMejorTiempo } = require('../controllers/runnerController');
const { verificarAdmin, verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los corredores, accesible solo por administradores
router.get('/', verificarAdmin, obtenerCorredores);

// Ruta para obtener el mejor corredor
router.get('/best', verificarToken, obtenerMejorCorredor);

// Ruta para obtener el ranking de corredores con vueltas registradas
router.get('/ranking', verificarToken, obtenerRankingCorredores);

// Ruta para obtener el ranking de corredores con mejor tiempo por vuelat
router.get('/ranking-vuelta', verificarAdmin, obtenerRankingMejorTiempo);

module.exports = router;
