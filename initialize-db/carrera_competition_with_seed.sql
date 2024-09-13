
CREATE DATABASE IF NOT EXISTS carrera_competition;

USE carrera_competition;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(15),
  foto_perfil VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'corredor') DEFAULT 'corredor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Equipos
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  foto_perfil VARCHAR(255),
  descripcion TEXT
);

-- Tabla de Corredores
CREATE TABLE IF NOT EXISTS runners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  edad INT,
  equipo_id INT NULL,
  ranking INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (equipo_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- Tabla de Tiempos
CREATE TABLE IF NOT EXISTS times (
  id INT AUTO_INCREMENT PRIMARY KEY,
  runner_id INT NOT NULL,
  vuelta INT NOT NULL,
  tiempo FLOAT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (runner_id) REFERENCES runners(id) ON DELETE CASCADE
);

-- Tabla de Logs de Auditoría
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255),
  entity VARCHAR(255),
  entity_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba para Usuarios (un admin y dos corredores)
INSERT INTO users (nombre, email, telefono, foto_perfil, password, rol) VALUES
('Admin User', 'admin@carrera.com', '123456789', 'admin.jpg', 'admin123456', 'admin')
;
