// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guardar los archivos en la carpeta `public/uploads`
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    // Asigna un nombre único al archivo (puedes usar un timestamp y el nombre original)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  agregarUsuario,
  eliminarUsuario
} = require('../controllers/userController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

// Ruta para agregar/eliminar un usuario, solo accesible por administradores
router.post('/add',
  verificarAdmin,
  upload.single("foto_perfil"),
  agregarUsuario
);

router.delete('/delete/:id', verificarAdmin, eliminarUsuario);

module.exports = router;
