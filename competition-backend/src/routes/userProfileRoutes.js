const express = require('express');
const { verPerfil, editarPerfil } = require('../controllers/userProfileController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para ver el perfil del usuario (solo accesible para usuarios autenticados)
router.get('/user-profile', verificarToken, verPerfil);

// Ruta para editar el perfil del usuario (solo accesible para usuarios autenticados)
router.put('/user-profile', verificarToken, editarPerfil);

module.exports = router;
