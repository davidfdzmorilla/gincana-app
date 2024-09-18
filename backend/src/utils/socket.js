let io;

// Inicializar Socket.IO con el servidor
const initSocket = (server) => {
  const socketIo = require("socket.io");
  io = socketIo(server, {
    cors: {
      origin: "https://gincana.dungeonindustria.ddns.net",
      methods: ["GET", "POST", "PUT", "DELETE"],
      // credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};

// Emitir actualizaciones de tiempos
const emitirActualizacionTiempos = (tiemposActualizados) => {
  if (io) {
    console.log(
      "Emitiendo evento actualizacionTiempos con datos:",
      tiemposActualizados
    ); // Log para depuración
    io.emit("actualizacionTiempos", tiemposActualizados); // Emitir el evento a todos los clientes conectados
  } else {
    console.log("Socket.IO no está inicializado correctamente.");
  }
};

module.exports = { initSocket, emitirActualizacionTiempos };
