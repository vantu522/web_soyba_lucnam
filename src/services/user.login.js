import axios from "axios";

export const loginUser = async (cccd, password) => {
  try {
    const response = await axios.post('http://localhost:1106/api/auth/login', {
      cccd,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const changePassword = async (cccd, newPassword, token) => {
  try {
    const response = await axios.post('http://localhost:1106/api/auth/change-password', {
      cccd,
      newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};