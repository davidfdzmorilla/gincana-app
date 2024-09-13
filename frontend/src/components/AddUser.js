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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userService.addUser({ nombre, email, telefono, password, edad, equipo, rol });
      setSuccess('Usuario añadido exitosamente');
      setError('');
      setIsFading(false);

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
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Edad</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Equipo</label>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
