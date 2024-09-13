const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket');

const PORT = process.env.PORT || 5500;

// Crear el servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO con initSocket
initSocket(server);

// Iniciar el servidor en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
