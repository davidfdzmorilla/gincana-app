
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

-- Datos de prueba para Usuarios (un admin y dos corredores)
INSERT INTO users (nombre, email, telefono, foto_perfil, password, rol) VALUES
('Admin User', 'admin@carrera.com', '123456789', 'admin.jpg', 'hashed_password_admin', 'admin'),
('Corredor 1', 'corredor1@carrera.com', '987654321', 'corredor1.jpg', 'hashed_password1', 'corredor'),
('Corredor 2', 'corredor2@carrera.com', '555555555', 'corredor2.jpg', 'hashed_password2', 'corredor');

-- Datos de prueba para Equipos
INSERT INTO teams (nombre, descripcion) VALUES
('Equipo A', 'Descripción del equipo A'),
('Equipo B', 'Descripción del equipo B');

-- Datos de prueba para Corredores (asociados a los usuarios y equipos)
INSERT INTO runners (user_id, edad, equipo_id, ranking) VALUES
(2, 25, 1, 1), -- Corredor 1 en el Equipo A
(3, 30, 2, 2); -- Corredor 2 en el Equipo B

-- Datos de prueba para Tiempos (tiempos para los corredores)
INSERT INTO times (runner_id, vuelta, tiempo) VALUES
(1, 1, 360.5), -- Corredor 1, vuelta 1
(1, 2, 355.0), -- Corredor 1, vuelta 2
(2, 1, 400.2), -- Corredor 2, vuelta 1
(2, 2, 390.3); -- Corredor 2, vuelta 2
