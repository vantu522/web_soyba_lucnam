import axios from "axios";
import { API_URL } from "../configs/constants";
export const getHealthRecordsListByCCCD = async ( token) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await axios.get(`${API_URL}/yba`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw error;
  }
};

export const getHealthRecordByCCCDAndLK = async ( ma_lk, token) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await axios.get(`${API_URL}/yba/kq?ma_lk=${ma_lk}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching health record by CCCD and LK:", error);
    throw error;
  }   
};


