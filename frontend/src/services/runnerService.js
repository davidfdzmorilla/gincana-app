import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getRanking = async () => {
  const response = await axios.get(`${API_URL}/runners/ranking`);
  console.log("Ranking:", response.data);
  return response.data;
};


const getRankingMejorVuelta = async () => {
  const response = await axios.get(`${API_URL}/laps/ranking-mejor-vuelta`);
  return response.data;
};

// Coger los corredores
const getCorredores = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/runners`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Coger las vueltas de un corredor
const getVueltas = async (runnerId) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/laps/corredor/${runnerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Eliminar corredor
const deleteCorredor = async (runnerId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/users/delete/${runnerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al eliminar corredor:", err);
  }
};

// Eliminar vuelta
const deleteVuelta = async (lap) => {
  const token = localStorage.getItem("token");
  console.log("Eliminando vuelta:", lap);
  try {
    const response = await axios.delete(`${API_URL}/laps/delete/${lap}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al eliminar vuelta:", err);
  }
};

const runnerService = {
  getRanking,
  getCorredores,
  getVueltas,
  deleteCorredor,
  deleteVuelta,
  getRankingMejorVuelta,
};

export default runnerService;
