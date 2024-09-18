import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFading, setIsFading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Comprobar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Redirigir al usuario a la página de ranking si ya está autenticado
      navigate("/ranking");
    }
  }, [navigate]);

  // Función para validar el formato de email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones del lado del cliente
    if (!validateEmail(email)) {
      setValidationError("El formato del email no es válido.");
      return;
    }

    if (password.trim() === "") {
      setValidationError("La contraseña no puede estar vacía.");
      return;
    }

    // Limpiar errores de validación si todo es correcto
    setValidationError("");

    try {
      const response = await authService.login({ email, password });

      // Guardar el token en localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);

      // Redirigir al usuario a una página protegida
      navigate("/ranking");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error desconocido");
      } else {
        setError("Error al intentar iniciar sesión.");
      }
    }
  };

  // useEffect para limpiar los mensajes de éxito o error después de 5 segundos y aplicar el fade-out
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setIsFading(true); // Iniciar fade-out
        const fadeTimer = setTimeout(() => {
          setError("");
        }, 500); // El tiempo de la animación de fade-out (500ms)
        return () => clearTimeout(fadeTimer);
      }, 4500); // Esperar 4.5 segundos antes de empezar el fade-out

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {error && (
        <div
          className={`${
            isFading ? "fade-out" : "slide-in"
          } bg-red-500 text-white p-4 rounded-md mb-4`}
        >
          {error}
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Mostrar errores de validación */}
        {validationError && (
          <p className="text-red-500 mb-4">{validationError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Introduce tu email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Introduce tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
