const express = require('express');
const { login } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Verificar token
router.get('/verify-token', verificarToken, (req, res) => {
  res.status(200).json({ message: 'Token válido.' });
});

module.exports = router;
