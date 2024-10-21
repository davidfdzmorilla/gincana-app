import axios from "axios";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";

const API_URL = process.env.REACT_APP_API_URL;

// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_URL,
});

// Agregar un interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente retornarla
    return response;
  },
  (error) => {
    // Si hay un error con status 401, redirigir al login solo si no estamos ya en el login
    if (error.response && error.response.status === 401) {
      const { setUser } = useContext(UserContext);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      const currentPath = window.location.pathname;

      // Evitar redirección si ya estamos en la página de login
      if (currentPath !== "/dashboard/login") {
        window.location.href = "/dashboard/login";
      }
    }
    // Retornar el error para seguir manejándolo si es necesario
    return Promise.reject(error);
  }
);

export default api;
