import { useState, useEffect, useContext } from "react";
import runnerService from "../services/runnerService";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";
import { RiMedal2Fill } from "react-icons/ri";
import FlagEffect from "./FlagEffect";

let socket;

const RankingPublic = () => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) {
      socket = io(REACT_APP_API_URL);
    }

    const fetchRanking = async () => {
      try {
        const data = await runnerService.getRankingMejorVuelta();
        setRanking(data.corredores);
        setLoading(false);
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

  // Función para formatear el tiempo
  const formatearTiempo = (tiempoEnSegundos) => {
    const tiempoEnMilisegundos = tiempoEnSegundos * 1000;
    const horas = Math.floor(tiempoEnMilisegundos / (1000 * 60 * 60));
    const minutos = Math.floor(
      (tiempoEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60)
    );
    const segundos = Math.floor((tiempoEnMilisegundos % (1000 * 60)) / 1000);
    const milisegundos = Math.floor((tiempoEnMilisegundos % 1000) / 10);
    return `${horas}:${minutos < 10 ? "0" : ""}${minutos}:${segundos < 10 ? "0" : ""
      }${segundos}.${milisegundos < 10 ? "0" : ""}${milisegundos}`;
  };

  // Comparar el nuevo ranking con el anterior para asegurarse de que haya animación
  const getUniqueKey = (corredor) =>
    `${corredor.runner_id}-${corredor.tiempo_total}-${corredor.total_vueltas}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8 pb-20 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white min-h-screen">
        <FlagEffect />
        <h3 className="text-2xl font-bold mt-36">Ranking de Corredores</h3>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 pb-20 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-white min-h-screen">
      <FlagEffect />
      <h3 className="text-2xl font-bold mt-36 mb-6">Ranking de Corredores</h3>
      <ul className="ranking-list space-y-4 pb-4 w-full flex flex-col items-center">
        {ranking.length === 0 && <p>No hay tiempos registrados.</p>}
        <AnimatePresence>
          {ranking.map((corredor, index) => (
            !corredor.foto_perfil ? corredor.foto_perfil = `${REACT_APP_API_URL}/uploads/avatar.webp` : corredor.foto_perfil,
            <motion.li
              key={getUniqueKey(corredor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`ranking-item w-full flex items-center justify-between ${index === 0 || index <= 2 ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg`}
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
                <p className="text-2xl font-extrabold">
                  {corredor.nombre.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </p>
                {/* <p className="text-sm text-gray-500">
                  {corredor.equipo_nombre}
                </p> */}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">Vuelta {corredor.total_vueltas}</p>
                <p className="text-xl font-black">
                  {formatearTiempo(corredor.mejor_tiempo)}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default RankingPublic;
