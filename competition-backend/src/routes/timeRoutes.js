const express = require('express');
const { registrarTiempo, borrarTiempo } = require('../controllers/timeController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para registrar tiempos, solo accesible por administradores
router.post('/register', verificarAdmin, registrarTiempo);

// Ruta para borrar tiempos, solo accesible por administradores
router.delete('/delete/:id', verificarAdmin, borrarTiempo);

module.exports = router;
