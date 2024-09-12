const bcrypt = require('bcryptjs');

// Función para generar el hash de una contraseña
const generarHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
};

// Hashear una contraseña de prueba
generarHash('admin123456');
