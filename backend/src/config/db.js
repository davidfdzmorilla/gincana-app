const mysql = require('mysql2/promise'); 
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear la conexión a la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = db;
