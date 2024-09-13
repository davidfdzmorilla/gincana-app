import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getRanking = async () => {
  const token = localStorage.getItem('token'); // Asegúrate de tener el token almacenado
  const response = await axios.get(`${API_URL}/runners/ranking`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const runnerService = {
  getRanking
};

export default runnerService;
