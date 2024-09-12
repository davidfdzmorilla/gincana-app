const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Crear la app de Express
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
