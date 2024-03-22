import axios from 'axios'

const getDataAPI = async (endpoint, type, dataQuery, session) => {

  const headers = {
    'Authorization': `Bearer ${session}`
  };

  try {
    if (type === 'POST') {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${endpoint}`, dataQuery, { headers });
      if (response.data) {
        return response.data;
      }
    } else if (type === 'GET') {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_IP}/${endpoint}`, { headers });
      if (response.data) {
        return response.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default getDataAPI