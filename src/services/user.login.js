import axios from "axios";
import { API_URL } from "../configs/constants";

export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/customers/login`, {
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
    const response = await axios.post(`${API_URL}/customers/change-password`, {
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