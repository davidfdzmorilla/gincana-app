import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Usar la URL del backend

const getRanking = async () => {
  try {
    const response = await axios.get(`${API_URL}/runners/ranking`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Si necesitas autenticación con JWT
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el ranking:', error);
    throw error;
  }
};

const runnerService = {
  getRanking
};

export default runnerService;
