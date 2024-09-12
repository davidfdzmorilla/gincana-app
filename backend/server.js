const app = require('./src/app');
const db = require('./src/config/db'); // Cargar la conexión a la base de datos

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
