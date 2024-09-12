// src/routes/userRoutes.js
const express = require('express');
const { agregarUsuario } = require('../controllers/userController');
const { eliminarUsuario } = require('../controllers/userController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para agregar/eliminar un usuario, solo accesible por administradores
router.post('/add', verificarAdmin, agregarUsuario);
router.delete('/delete/:id', verificarAdmin, eliminarUsuario);

module.exports = router;
