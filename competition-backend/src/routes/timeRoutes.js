const express = require('express');
const { registrarTiempo } = require('../controllers/timeController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para registrar tiempos, solo accesible por administradores
router.post('/register', verificarAdmin, registrarTiempo);

module.exports = router;
