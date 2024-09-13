import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getTeams = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_URL}/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const teamService = {
  getTeams,
};

export default teamService;
