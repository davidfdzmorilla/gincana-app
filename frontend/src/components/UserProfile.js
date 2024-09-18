import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import userService from "../services/userService";
import { FaPlus } from "react-icons/fa";
import Spinner from "./Spinner";

const UserProfile = () => {
  const API_URL = process.env.REACT_APP_API_URL; // URL base de tu API
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(`${API_URL}/uploads/avatar.webp`); // Ruta por defecto
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFading, setIsFading] = useState(false); // Inicializa isFading

  // Referencia al input de archivo
  const fileInputRef = useRef(null);

  // Hook para cargar los datos del usuario y la imagen de perfil
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
      });
      // Mostrar la imagen del usuario si tiene una, de lo contrario, usar avatar.webp
      setPreview(
        user.foto_perfil
          ? `${API_URL}${user.foto_perfil}`
          : `${API_URL}/uploads/avatar.webp`
      );
    }
  }, [user, API_URL]);

  // Hook para manejar la animación de fade-out de los mensajes
  useEffect(() => {
    if (success || error) {
      setIsFading(false); // Reinicia isFading al mostrar un nuevo mensaje
      const timer = setTimeout(() => {
        setIsFading(true); // Inicia el fade-out
        const fadeTimer = setTimeout(() => {
          setSuccess("");
          setError("");
          setIsFading(false); // Reinicia isFading después del fade-out
        }, 500); // Duración de la animación de fade-out
        return () => clearTimeout(fadeTimer);
      }, 4500); // Tiempo antes de iniciar el fade-out

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Mueve el retorno condicional después de los Hooks
  if (!user) {
    return <Spinner />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Crear una URL temporal para mostrar la vista previa
      setPreview(URL.createObjectURL(file));
    }
  };

  // Función para abrir el selector de archivos al hacer clic en el avatar
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = new FormData();
    userData.append("nombre", formData.nombre);
    userData.append("email", formData.email);
    userData.append("telefono", formData.telefono);
    if (avatar) {
      userData.append("foto_perfil", avatar);
    }

    try {
      const response = await userService.editUser(userData);
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        setSuccess("Perfil actualizado correctamente");
        setError("");
      }
    } catch (err) {
      setSuccess("");
      setError("Hubo un error al actualizar el perfil");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Edita tu Perfil
        </h1>
        {/* Mostrar mensaje de éxito o error con animaciones */}
        {success && (
          <div
            className={`${
              isFading ? "fade-out" : "slide-in"
            } bg-green-500 text-white p-4 rounded-md mb-4 transition-all duration-500`}
          >
            {success}
          </div>
        )}
        {error && (
          <div
            className={`${
              isFading ? "fade-out" : "slide-in"
            } bg-red-500 text-white p-4 rounded-md mb-4 transition-all duration-500`}
          >
            {error}
          </div>
        )}
        <div className="flex flex-col items-center mb-6 relative">
          <img
            src={preview}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div
            onClick={handleAvatarClick}
            className="absolute top-0 w-32 h-32 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 bg-opacity-50 cursor-pointer transition-opacity duration-300"
          >
            <FaPlus className="text-black text-4xl" />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono:
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
