import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/users/add`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const editUser = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/profile/user-profile`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const userService = {
  addUser,
  editUser,
};

export default userService;
