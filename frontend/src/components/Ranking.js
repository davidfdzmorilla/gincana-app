import { useState, useEffect, useContext } from 'react';
import runnerService from '../services/runnerService';
import { UserContext } from '../context/UserContext';

const Ranking = () => {
  const { user } = useContext(UserContext);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await runnerService.getRanking();
        setRanking(data.corredores); // Asumiendo que los datos están en "corredores"
      } catch (error) {
        console.error('Error al obtener el ranking:', error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div>
      <h2>Ranking de Corredores</h2>
      {user && (
        <p>Bienvenido, {user.nombre}! (Rol: {user.rol})</p>
      )}
      <ul>
        {ranking.map((runner, index) => (
          <li key={runner.runner_id}>
            <strong>{index + 1}. {runner.corredor_nombre}</strong> <br />
            Equipo: {runner.equipo_nombre} <br />
            Tiempo Total: {runner.tiempo_total} segundos <br />
            Total de Vueltas: {runner.total_vueltas} <br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ranking;
