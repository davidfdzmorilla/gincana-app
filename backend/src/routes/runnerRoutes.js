const express = require('express');
const { obtenerCorredores } = require('../controllers/runnerController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los corredores, accesible solo por administradores
router.get('/', verificarAdmin, obtenerCorredores);

module.exports = router;
