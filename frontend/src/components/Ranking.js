import { useState, useEffect, useContext } from "react";
import runnerService from "../services/runnerService";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";
import Spinner from "./Spinner";
import { RiMedal2Fill } from "react-icons/ri";

let socket;

const Ranking = () => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const { user } = useContext(UserContext);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (!socket) {
      socket = io(REACT_APP_API_URL);
    }

    const fetchRanking = async () => {
      try {
        const data = await runnerService.getRanking();
        setRanking(data.corredores);
      } catch (error) {
        console.error("Error al obtener el ranking:", error);
      }
    };

    fetchRanking();

    // Escuchar el evento de WebSocket para actualizaciones
    socket.on("actualizacionTiempos", (data) => {
      fetchRanking();
    });

    // Limpiar el socket al desmontar el componente
    return () => {
      if (socket) {
        socket.off("actualizacionTiempos");
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  if (!user) {
    return <Spinner />;
  }

  // Función para formatear el tiempo
  const formatearTiempo = (tiempoEnSegundos) => {
    const tiempoEnMilisegundos = tiempoEnSegundos * 1000;
    const horas = Math.floor(tiempoEnMilisegundos / (1000 * 60 * 60));
    const minutos = Math.floor(
      (tiempoEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60)
    );
    const segundos = Math.floor((tiempoEnMilisegundos % (1000 * 60)) / 1000);
    const milisegundos = Math.floor((tiempoEnMilisegundos % 1000) / 10);
    return `${horas}:${minutos < 10 ? "0" : ""}${minutos}:${
      segundos < 10 ? "0" : ""
    }${segundos}.${milisegundos < 10 ? "0" : ""}${milisegundos}`;
  };

  // Comparar el nuevo ranking con el anterior para asegurarse de que haya animación
  const getUniqueKey = (corredor) =>
    `${corredor.runner_id}-${corredor.tiempo_total}-${corredor.total_vueltas}`;

  return (
    <div className="flex flex-col items-center p-8 pb-20 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Ranking de Corredores</h1>
      <ul className="ranking-list space-y-4 pb-4 w-full flex flex-col items-center">
        {ranking.length === 0 && <p>No hay tiempos registrados.</p>}
        <AnimatePresence>
          {ranking.map((corredor, index) => (
            <motion.li
              key={getUniqueKey(corredor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="ranking-item w-full flex items-center justify-between bg-white text-gray-800 p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="relative">
                {index === 0 && (
                  <RiMedal2Fill className="medalla text-yellow-400 text-4xl" />
                )}
                {index === 1 && (
                  <RiMedal2Fill className="medalla text-gray-400 text-4xl" />
                )}
                {index === 2 && (
                  <RiMedal2Fill className="medalla text-orange-400 text-4xl" />
                )}
                {index > 2 && (
                  <span className="puesto font-bold text-3xl">{index + 1}</span>
                )}
              </div>
              <img
                src={`${REACT_APP_API_URL}${corredor.foto_perfil}`}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 ml-4">
                <p className="text-lg font-semibold">
                  {corredor.corredor_nombre}
                </p>
                <p className="text-sm text-gray-500">
                  {corredor.equipo_nombre}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg">Vuelta {corredor.total_vueltas}</p>
                <p className="text-sm text-gray-600">
                  {formatearTiempo(corredor.tiempo_total)}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Ranking;
