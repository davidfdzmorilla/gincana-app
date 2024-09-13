import { useState, useEffect } from 'react';
import userService from '../services/userService';
import teamService from '../services/teamService';

const AddUser = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [equipo, setEquipo] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [rol, setRol] = useState('corredor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isFading, setIsFading] = useState(false);

  // Cargar equipos desde la API cuando se monte el componente
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const equiposData = await teamService.getTeams();
        setEquipos(equiposData);
      } catch (err) {
        setError('Error al obtener los equipos');
      }
    };

    fetchEquipos();
  }, []);

  // Función para validar el formulario
  const validateForm = () => {
    let errors = {};

    // Validar nombre
    if (!nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }

    // Validar email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(email)) {
      errors.email = 'El formato del email es incorrecto';
    }

    // Validar teléfono
    const telefonoRegex = /^[0-9]{9}$/;
    if (telefono && !telefonoRegex.test(telefono)) {
      errors.telefono = 'El teléfono debe contener solo 9 dígitos';
    }

    // Validar contraseña
    if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar edad
    if (!edad || edad <= 0) {
      errors.edad = 'La edad debe ser mayor a 0';
    }

    // Validar equipo
    if (!equipo.trim()) {
      errors.equipo = 'Debes seleccionar o ingresar un equipo';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    try {
      await userService.addUser({ nombre, email, telefono, password, edad, equipo, rol });
      setSuccess('Usuario añadido exitosamente');
      setError('');
      setIsFading(false);
      setValidationErrors({});

      // Limpiar formulario
      setNombre('');
      setEmail('');
      setTelefono('');
      setPassword('');
      setEdad('');
      setEquipo('');
      setRol('corredor');
    } catch (err) {
      setError('Hubo un error al añadir el usuario');
      setSuccess('');
      setIsFading(false);
    }
  };

  // useEffect para limpiar los mensajes de éxito o error después de 5 segundos y aplicar el fade-out
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setIsFading(true); // Iniciar fade-out
        const fadeTimer = setTimeout(() => {
          setSuccess('');
          setError('');
        }, 500); // El tiempo de la animación de fade-out (500ms)
        return () => clearTimeout(fadeTimer);
      }, 4500); // Esperar 4.5 segundos antes de empezar el fade-out

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Añadir Corredor</h2>

        {/* Mostrar mensaje de éxito o error con animaciones */}
        {success && (
          <div
            className={`${isFading ? 'fade-out' : 'slide-in'
              } bg-green-500 text-white p-4 rounded-md mb-4`}
          >
            {success}
          </div>
        )}
        {error && (
          <div
            className={`${isFading ? 'fade-out' : 'slide-in'
              } bg-red-500 text-white p-4 rounded-md mb-4`}
          >
            {error}
          </div>
        )}
<form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              required
            />
            {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              required
            />
            {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {validationErrors.telefono && <p className="text-red-500 text-sm">{validationErrors.telefono}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              required
            />
            {validationErrors.password && <p className="text-red-500 text-sm">{validationErrors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Edad</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.edad ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {validationErrors.edad && <p className="text-red-500 text-sm">{validationErrors.edad}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Equipo</label>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className={`w-full px-4 py-2 border ${validationErrors.equipo ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            >
              <option value="">Selecciona un equipo o ingresa uno nuevo</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.nombre}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nuevo equipo (si no está en la lista)"
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
            />
            {validationErrors.equipo && <p className="text-red-500 text-sm">{validationErrors.equipo}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="corredor">Corredor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Añadir Corredor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
