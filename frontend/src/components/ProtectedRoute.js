import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Obtenemos el token del localStorage

  // Si no hay token, redirige al login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
