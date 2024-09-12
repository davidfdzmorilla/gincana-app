const express = require('express');
const { obtenerVueltas } = require('../controllers/lapController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todas las vueltas de un corredor, accesible solo para administradores
router.get('/corredor/:runner_id', verificarAdmin, obtenerVueltas);

module.exports = router;
