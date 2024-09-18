const express = require("express");
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
  verPerfil,
  editarPerfil,
} = require("../controllers/userProfileController");
const { verificarToken } = require("../middlewares/authMiddleware");

// Ruta para ver el perfil del usuario (solo accesible para usuarios autenticados)
router.get("/user-profile", verificarToken, verPerfil);

// Ruta para editar el perfil del usuario (solo accesible para usuarios autenticados)
router.put(
  "/user-profile",
  verificarToken,
  upload.single("foto_perfil"),
  editarPerfil
);

module.exports = router;
