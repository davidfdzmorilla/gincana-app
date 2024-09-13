import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getCorredores = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/runners/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getUltimaVuelta = async (runnerId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/laps/corredor/${runnerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

const registrarTiempo = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/times`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const timeService = {
  getCorredores,
  getUltimaVuelta,
  registrarTiempo,
};

export default timeService;
