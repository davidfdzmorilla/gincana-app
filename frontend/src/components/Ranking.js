import { useState, useEffect, useContext } from 'react';
import runnerService from '../services/runnerService';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../context/UserContext';

const Ranking = () => {
  const { user } = useContext(UserContext);
  const [ranking, setRanking] = useState([]);
  const socket = io(process.env.REACT_APP_API_URL);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await runnerService.getRanking();
        setRanking(data.corredores);
      } catch (error) {
        console.error('Error al obtener el ranking:', error);
      }
    };

    fetchRanking();

    // Escuchar eventos de WebSocket para actualizaciones
    socket.on('actualizacionTiempos', (data) => {
      fetchRanking();
    });

    // Limpiar el socket al desmontar el componente
    return () => {
      socket.off('actualizacionTiempos');
    };

  }, [socket]);

  // Comparar el nuevo ranking con el anterior para asegurarse de que haya animación
  const getUniqueKey = (corredor) => `${corredor.runner_id}-${corredor.tiempo_total}-${corredor.total_vueltas}`;

  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-screen min-w-screen">
      <h1 className="text-4xl font-bold mb-4">¡Bienvenido, {user.nombre}!</h1>
      <h2 className="text-2xl font-semibold mb-6">Ranking de Corredores</h2>

      <ul className="ranking-list space-y-4">
        <AnimatePresence>
          {ranking.map((corredor, index) => (
            <motion.li
              key={getUniqueKey(corredor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: .5 }}
              className="ranking-item flex items-center justify-between bg-white text-gray-800 p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span className="font-bold text-xl">{index + 1}.</span>
              <div className="flex-1 ml-4">
                <p className="text-lg font-semibold">{corredor.corredor_nombre}</p>
                <p className="text-sm text-gray-500">{corredor.equipo_nombre}</p>
              </div>
              <div className="text-right">
                <p className="text-lg">Vuelta {corredor.total_vueltas}</p>
                <p className="text-sm text-gray-600">{corredor.tiempo_total} segundos</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Ranking;
