import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getRanking = async () => {

  const token = localStorage.getItem("token");
  const response = await api.get(`${API_URL}/runners/ranking`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


const getRankingMejorVuelta = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/laps/ranking-mejor-vuelta`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

const getRankingMejorVueltaPublic = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/laps/ranking-mejor-vuelta-public`);

  return response.json();
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
const deleteVuelta = async (id) => {
  const token = localStorage.getItem("token");
  console.log("Eliminando vuelta:", id);
  try {
    const response = await axios.delete(`${API_URL}/laps/delete/${id}`, {
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
  getRankingMejorVueltaPublic,
};

export default runnerService;
