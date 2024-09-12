const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const timeRoutes = require('./routes/timeRoutes');
const lapRoutes = require('./routes/lapRoutes');

// Crear la app de Express
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/times', timeRoutes);
app.use('/laps', lapRoutes);
app.use('/profile', userProfileRoutes);

module.exports = app;
