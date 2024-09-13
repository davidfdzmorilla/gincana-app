import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }
};

export default authService;
