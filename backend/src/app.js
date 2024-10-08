const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const timeRoutes = require("./routes/timeRoutes");
const lapRoutes = require("./routes/lapRoutes");
const runnerRoutes = require("./routes/runnerRoutes");
const teamRoutes = require("./routes/teamRoutes");

// Crear la app de Express
const app = express();

// Habilitar CORS
app.use(
  cors({
    origin: "https://gincana.dungeonindustria.ddns.net",
    methods: "GET,POST,PUT,DELETE",
    crerdentials: true,
  })
);

// app.use(cors());

// Middleware para procesar JSON
app.use(express.json());

// Limitar a 100 solicitudes por hora desde la misma IP
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100, // Limitar cada IP a 100 solicitudes por hora
  message:
    "Demasiadas solicitudes de esta IP, por favor intente de nuevo después de una hora.",
});

// Rutas
app.use("/auth", loginLimiter, authRoutes);
app.use("/users", userRoutes);
app.use("/times", timeRoutes);
app.use("/laps", lapRoutes);
app.use("/profile", userProfileRoutes);
app.use("/runners", runnerRoutes);
app.use("/teams", teamRoutes);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

module.exports = app;
