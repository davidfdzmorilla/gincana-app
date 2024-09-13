import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const addUser = async (userData) => {
  const token = localStorage.getItem('token');
  console.log('Token enviado:', token); // Verifica el token
  const response = await axios.post(`${API_URL}/users/add`, userData, {
    headers: {
      Authorization: `Bearer ${token}`, // Verifica que el token no esté vacío
    },
  });
  console.log(response);
  return response.data;
};

const userService = {
  addUser,
};

export default userService;
