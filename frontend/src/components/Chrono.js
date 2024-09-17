import { useEffect, useState, useRef } from 'react';
import timeService from '../services/timeService';

function Chrono() {
  const [cronometros, setCronometros] = useState([]);
  const [corredores, setCorredores] = useState([]);
  const [selectedCorredor, setSelectedCorredor] = useState('');
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef({});

  // Bloquear recarga de la página si hay cronómetros en marcha
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (cronometros.some((crono) => crono.inicio)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cronometros]);

  // Obtener los corredores al montar el componente
  useEffect(() => {
    const fetchCorredores = async () => {
      try {
        const data = await timeService.getCorredores();
        if (data && data.corredores) {
          setCorredores(data.corredores);
        } else {
          throw new Error('Formato de datos incorrecto');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar corredores:', err);
        setLoading(false);
      }
    };
    fetchCorredores();
  }, []);

  // Obtener la última vuelta para el corredor seleccionado
  const obtenerUltimaVuelta = async (runnerId) => {
    try {
      const response = await timeService.getUltimaVuelta(runnerId);
      if (!response.vueltas.length) {
        return 1;
      }
      return response.vueltas.length + 1;
    } catch (error) {
      console.error('Error al obtener la última vuelta.');
      return 1;
    }
  };

  // Añadir un nuevo cronómetro
  const agregarCronometro = async () => {
    if (selectedCorredor) {
      const nuevaVuelta = await obtenerUltimaVuelta(selectedCorredor);
      const nuevoCronometro = {
        id: Date.now(), // ID único para el cronómetro
        corredorId: selectedCorredor,
        tiempo: 0,
        inicio: null,
        vuelta: nuevaVuelta,
        guardado: false,
        error: null,
      };
      setCronometros((prevCronometros) => [...prevCronometros, nuevoCronometro]);
      setSelectedCorredor(''); // Restablece el corredor seleccionado
    }
  };

  // Formatear el tiempo
  const formatearTiempo = (tiempoEnMilisegundos) => {
    const horas = Math.floor(tiempoEnMilisegundos / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoEnMilisegundos % (1000 * 60)) / 1000);
    const milisegundos = Math.floor((tiempoEnMilisegundos % 1000) / 10);
    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}.${milisegundos < 10 ? '0' : ''}${milisegundos}`;
  };

  // Iniciar cronómetro
  const iniciarCronometro = (id) => {
    setCronometros((prevCronometros) =>
      prevCronometros.map((crono) => {
        if (crono.id === id) {
          const startTime = performance.now() - crono.tiempo;
          crono.inicio = startTime;

          if (intervalRef.current[id]) {
            clearInterval(intervalRef.current[id]);
          }

          intervalRef.current[id] = setInterval(() => {
            const currentTime = performance.now();
            crono.tiempo = currentTime - startTime;
            setCronometros((prevCronos) =>
              prevCronos.map((prevCrono) => (prevCrono.id === id ? { ...crono } : prevCrono))
            );
          }, 10);
        }
        return crono;
      })
    );
  };

  // Detener cronómetro
  const detenerCronometro = (id) => {
    if (intervalRef.current[id]) {
      clearInterval(intervalRef.current[id]);
      intervalRef.current[id] = null;
    }
  };

  // Guardar el tiempo del cronómetro
  const guardarTiempo = async (id) => {
    detenerCronometro(id);

    setCronometros((prevCronometros) =>
      prevCronometros.map((crono) => {
        if (crono.id === id) {
          return { ...crono, guardado: true };
        }
        return crono;
      })
    );

    const crono = cronometros.find((c) => c.id === id);

    try {
      const tiempoEnSegundos = (crono.tiempo / 1000).toFixed(3);
      await timeService.registrarTiempo({
        runner_id: crono.corredorId,
        vuelta: crono.vuelta,
        tiempo: tiempoEnSegundos,
      });
    } catch (error) {
      console.error('Error al guardar el tiempo:', error);
      setCronometros((prevCronometros) =>
        prevCronometros.map((crono) => {
          if (crono.id === id) {
            return { ...crono, error: 'Error al guardar el tiempo' };
          }
          return crono;
        })
      );
    }
  };

  // Eliminar un cronómetro después de guardarlo
  const eliminarCronometro = (id) => {
    detenerCronometro(id);
    setCronometros((prevCronometros) => prevCronometros.filter((crono) => crono.id !== id));
    delete intervalRef.current[id];
  };

  if (loading) {
    return <div>Cargando corredores...</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-screen min-w-screen">
      <h2 className="text-2xl font-bold mb-4">Registro de Tiempos</h2>

      <div className="flex space-x-4">
        <select
          onChange={(e) => setSelectedCorredor(e.target.value)}
          value={selectedCorredor}
          className="bg-gray-200 text-black p-2 rounded"
        >
          <option value="">Selecciona un corredor</option>
          {corredores.map((corredor) => (
            <option key={corredor.runner_id} value={corredor.runner_id}>
              {corredor.nombre}
            </option>
          ))}
        </select>

        <button onClick={agregarCronometro} className="bg-blue-500 text-white px-4 py-2 rounded">
          Añadir Corredor
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {cronometros.map((cronometro) => (
          <div key={cronometro.id} className="bg-gray-100 p-4 rounded shadow-md">
            <p className="text-black">
              Corredor: {corredores.find((c) => c.runner_id === cronometro.corredorId)?.nombre}
            </p>
            <p className="text-black">Vuelta: {cronometro.vuelta}</p>
            <p className="text-black">Tiempo: {formatearTiempo(cronometro.tiempo)}</p>

            {!cronometro.guardado && (
              <>
                <button
                  onClick={() => iniciarCronometro(cronometro.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Iniciar
                </button>
                <button
                  onClick={() => detenerCronometro(cronometro.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Parar
                </button>
                <button
                  onClick={() => guardarTiempo(cronometro.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Guardar
                </button>
              </>
            )}

            {cronometro.guardado && (
              <>
                <p className="text-green-500">Tiempo guardado exitosamente</p>
                <button
                  onClick={() => eliminarCronometro(cronometro.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Cerrar
                </button>
              </>
            )}

            {cronometro.error && <p className="text-red-500">{cronometro.error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chrono;
