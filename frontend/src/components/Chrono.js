import { useEffect, useState, useRef } from 'react';
import timeService from '../services/timeService'; // Importamos el servicio

function Chrono() {
  const [cronometros, setCronometros] = useState([]);
  const [corredores, setCorredores] = useState([]);
  const [selectedCorredor, setSelectedCorredor] = useState('');
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef([]);

  // Obtener los corredores cuando se monta el componente
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
    const corredorYaTieneCronometro = cronometros.some(
      (cronometro) => cronometro.corredorId === selectedCorredor
    );

    if (corredorYaTieneCronometro) {
      alert('Este corredor ya tiene un cronómetro en marcha.');
      return;
    }

    if (selectedCorredor) {
      const nuevaVuelta = await obtenerUltimaVuelta(selectedCorredor);
      const nuevoCronometro = {
        corredorId: selectedCorredor,
        tiempo: 0,
        inicio: null,
        vuelta: nuevaVuelta,
        guardado: false,  // Estado que indica si el tiempo ha sido guardado
        error: null,  // Estado para manejar errores de guardado por cronómetro
      };
      setCronometros((prevCronometros) => [...prevCronometros, nuevoCronometro]);
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
  const iniciarCronometro = (index) => {
    const newCronometros = [...cronometros];
    const startTime = performance.now() - newCronometros[index].tiempo;
    newCronometros[index].inicio = startTime;

    intervalRef.current[index] = setInterval(() => {
      const currentTime = performance.now();
      newCronometros[index].tiempo = currentTime - startTime;
      setCronometros([...newCronometros]);
    }, 10);
  };

  // Detener cronómetro sin guardarlo
  const detenerCronometro = (index) => {
    clearInterval(intervalRef.current[index]);
  };

  // Guardar el tiempo del cronómetro
  const guardarTiempo = async (index) => {
    const newCronometros = [...cronometros];
    clearInterval(intervalRef.current[index]);

    try {
      const tiempoEnSegundos = (newCronometros[index].tiempo / 1000).toFixed(3);

      await timeService.registrarTiempo({
        runner_id: newCronometros[index].corredorId,
        vuelta: newCronometros[index].vuelta,
        tiempo: tiempoEnSegundos,
      });

      newCronometros[index].guardado = true;
      newCronometros[index].error = null; // Limpiar cualquier error si la operación fue exitosa
      setCronometros([...newCronometros]);
      console.log('Tiempo guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el tiempo:', error);
      newCronometros[index].error = 'Error al guardar el tiempo'; // Marcar el error en el cronómetro
      setCronometros([...newCronometros]);
    }
  };

  if (loading) {
    return <div>Cargando corredores...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Registro de Tiempos</h2>

      <div className="flex space-x-4">
        <select
          onChange={(e) => setSelectedCorredor(e.target.value)}
          value={selectedCorredor}
          className="bg-gray-200 p-2 rounded"
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
        {cronometros.map((cronometro, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded shadow-md">
            <p className="text-lg">Corredor: {corredores.find(c => c.runner_id === cronometro.corredorId)?.nombre}</p>
            <p>Vuelta: {cronometro.vuelta}</p>
            <p>Tiempo: {formatearTiempo(cronometro.tiempo)}</p>

            {!cronometro.guardado && (
              <>
                <button
                  onClick={() => iniciarCronometro(index)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Iniciar
                </button>
                <button
                  onClick={() => detenerCronometro(index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Parar
                </button>
                <button
                  onClick={() => guardarTiempo(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Guardar
                </button>
              </>
            )}

            {cronometro.guardado && <p className="text-green-500">Tiempo guardado exitosamente</p>}

            {cronometro.error && <p className="text-red-500">{cronometro.error}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chrono;
