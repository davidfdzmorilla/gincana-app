const express = require('express');
const { obtenerCorredores, obtenerMejorCorredor, obtenerRankingCorredores } = require('../controllers/runnerController');
const { verificarAdmin, verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los corredores, accesible solo por administradores
router.get('/', verificarAdmin, obtenerCorredores);

// Ruta para obtener el mejor corredor
router.get('/best', verificarToken, obtenerMejorCorredor);

// Ruta para obtener el ranking de corredores
router.get('/ranking', verificarToken, obtenerRankingCorredores);

module.exports = router;
