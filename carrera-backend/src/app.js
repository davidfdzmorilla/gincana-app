const express = require('express');
const authRoutes = require('./routes/authRoutes');

// Crear la app de Express
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

module.exports = app;
