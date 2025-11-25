import axios from "axios";

export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post('https://bvdk333.work/api/customers/login', {
      identifier,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const changePassword = async (identifier, newPassword, token) => {
  try {
    const response = await axios.post('https://bvdk333.work/api/customers/change-password', {
      identifier,
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