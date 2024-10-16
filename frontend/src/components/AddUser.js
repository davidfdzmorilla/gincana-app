import { useState, useRef, useEffect } from "react";
import userService from "../services/userService";
import { FaPlus } from "react-icons/fa";

const AddUser = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "corredor",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isFading, setIsFading] = useState(false);
  const [preview, setPreview] = useState(`${API_URL}/uploads/avatar.webp`); // Ruta por defecto
  const [avatar, setAvatar] = useState(null); // Avatar del usuario
  const [submit, setIsSubmit] = useState(false);

  const fileInputRef = useRef(null);

  // Función para validar el formulario
  const validateForm = () => {
    let errors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    // Si el rol es admin, validar email y contraseña
    if (formData.rol === "admin") {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!formData.email.trim()) {
        errors.email = "El email es obligatorio";
      } else if (!emailRegex.test(formData.email)) {
        errors.email = "El formato del email es incorrecto";
      }

      if (formData.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file); // Guardar el archivo (objeto File) en el estado
      setPreview(URL.createObjectURL(file)); // Mostrar la vista previa
    }
  };

  // Función para abrir el selector de archivos al hacer clic en el avatar
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsSubmit(true);

    const userData = new FormData();

    userData.append("nombre", formData.nombre);
    userData.append("rol", formData.rol);

    if (formData.rol === "admin") {
      userData.append("email", formData.email);
      userData.append("password", formData.password);
    }

    // Agregar el archivo solo si fue seleccionado
    if (avatar) {
      userData.append("foto_perfil", avatar);
    }

    try {
      const response = await userService.addUser(userData);
      console.log(response);
      if (response.status === 201) {
        setIsSubmit(false);
        setError("");
        setSuccess("Usuario añadido exitosamente");
        setFormData({
          nombre: "",
          email: "",
          password: "",
          rol: "corredor",
        });
        setPreview(`${API_URL}/uploads/avatar.webp`);
        setAvatar(null);
      }
    } catch (err) {
      setSuccess("");
      setIsSubmit(false);
      setError(err.response.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-2 pb-20 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white min-h-screen">
      <div className="w-full bg-green-600 py-8 rounded-lg shadow-lg max-w-lg">
        <h1 className="text-2xl font-bold px-6 text-center text-white">Añadir Corredor</h1>

        {/* Mostrar mensaje de éxito o error con animaciones */}
        {success && (
          <div
            className={`${isFading ? "fade-out" : "slide-in"
              } bg-green-500 text-white p-4 rounded-md mb-4`}
          >
            {success}
          </div>
        )}
        {error && (
          <div
            className={`${isFading ? "fade-out" : "slide-in"
              } bg-red-500 text-white p-4 rounded-md mb-4`}
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
        <form className="form-add-user w-full p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block text-white font-bold py-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${validationErrors.nombre ? "border-red-500" : "border-gray-300"
                } rounded-md text-gray-900`}
              required
            />
            {validationErrors.nombre && (
              <p className="text-red-500 text-sm">{validationErrors.nombre}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white font-bold py-2">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
            >
              <option value="corredor">Corredor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Si el rol es admin, mostrar los campos de email y contraseña */}
          {formData.rol === "admin" && (
            <>
              <div className="mb-4">
                <label className="block text-white font-bold py-2">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${validationErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-900`}
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm">{validationErrors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-white font-bold py-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${validationErrors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md text-gray-900`}
                  required
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {submit ? "Enviando..." : "Añadir Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
