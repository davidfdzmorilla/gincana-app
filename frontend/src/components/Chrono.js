import { useEffect, useState, useRef } from 'react';
import timeService from '../services/timeService'; // Importamos el servicio

function Chrono() {
  const [cronometros, setCronometros] = useState([]);
  const [corredores, setCorredores] = useState([]);
  const [selectedCorredor, setSelectedCorredor] = useState('');
  const [loading, setLoading] = useState(true); // Añadimos estado de carga
  const [error, setError] = useState(''); // Estado para manejar posibles errores
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
        setLoading(false); // Deshabilitar la carga una vez que tengamos los datos
      } catch (err) {
        console.error('Error al cargar corredores:', err); // Capturar y mostrar el error
        setError('Error al cargar corredores.');
        setLoading(false); // Asegurarse de que se detenga la carga en caso de error
      }
    };

    fetchCorredores();
  }, []);

  // Obtener la última vuelta para el corredor seleccionado
  const obtenerUltimaVuelta = async (runnerId) => {
    try {
      const response = await timeService.getUltimaVuelta(runnerId);
      // Si no hay vueltas, establecer la primera
      if (!response.vueltas.length) {
        return 1;
      }
      return response.vueltas.length + 1; // Sumar 1 a la vuelta actual para registrar la siguiente
    } catch (error) {
      setError('Error al obtener la última vuelta.');
      return 1;
    }
  };

  // Añadir un nuevo cronómetro
  const agregarCronometro = async () => {
    if (selectedCorredor) {
      const nuevaVuelta = await obtenerUltimaVuelta(selectedCorredor);
      const nuevoCronometro = {
        corredorId: selectedCorredor,
        tiempo: 0,
        inicio: null,
        vuelta: nuevaVuelta,
      };
      setCronometros((prevCronometros) => [...prevCronometros, nuevoCronometro]);
    }
  };

  // Función para formatear el tiempo
  const formatearTiempo = (tiempoEnMilisegundos) => {
    const horas = Math.floor(tiempoEnMilisegundos / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoEnMilisegundos % (1000 * 60)) / 1000);
    const milisegundos = Math.floor((tiempoEnMilisegundos % 1000) / 10); // Mostrar solo 2 decimales

    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}.${milisegundos < 10 ? '0' : ''}${milisegundos}`;
  };

  // Iniciar el cronómetro
  const iniciarCronometro = (index) => {
    const newCronometros = [...cronometros];
    const startTime = performance.now() - newCronometros[index].tiempo; // Ajustar el tiempo de inicio

    newCronometros[index].inicio = startTime;

    intervalRef.current[index] = setInterval(() => {
      const currentTime = performance.now();
      newCronometros[index].tiempo = currentTime - startTime; // Calcular tiempo total
      setCronometros((prevCronometros) => [...prevCronometros]);
    }, 10); // Actualización cada 10ms
  };

  // Detener el cronómetro y guardar el tiempo
  const detenerYGuardar = async (index) => {
    const newCronometros = [...cronometros];
    clearInterval(intervalRef.current[index]);

    try {
      // Convertir el tiempo a segundos con milésimas
      const tiempoEnSegundos = (newCronometros[index].tiempo / 1000).toFixed(3);

      await timeService.registrarTiempo({
        runner_id: newCronometros[index].corredorId,
        vuelta: newCronometros[index].vuelta,
        tiempo: tiempoEnSegundos,
      });
      console.log('Tiempo guardado exitosamente');
    } catch (error) {
      setError('Error al guardar el tiempo.');
    }

    setCronometros((prevCronometros) => prevCronometros.filter((_, i) => i !== index)); // Eliminar cronómetro después de guardar
  };

  if (loading) {
    return <div>Cargando corredores...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
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
            <button
              onClick={() => iniciarCronometro(index)}
              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            >
              Iniciar
            </button>
            <button
              onClick={() => detenerYGuardar(index)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Detener y Guardar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chrono;
