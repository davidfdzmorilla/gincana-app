const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket'); // Usar initSocket para inicializar Socket.IO

const PORT = process.env.PORT || 5000;

// Crear el servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO con initSocket
initSocket(server); // Aquí llamamos a la función para inicializar Socket.IO

// Iniciar el servidor en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
