import axios from "axios";

export const getHealthRecordsListByCCCD = async ( token) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await axios.get(`https://bvdk333.work/api/yba`, { headers });
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
    const response = await axios.get(`https://bvdk333.work/api/yba/kq?ma_lk=${ma_lk}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching health record by CCCD and LK:", error);
    throw error;
  }   
};


