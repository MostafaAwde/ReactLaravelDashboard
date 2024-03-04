import axios from "axios";

const axiosClient = axios.create({
  // we can specify /api here or in .env
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  const userName = localStorage.getItem("USER_NAME");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use((response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('USER_NAME');
      }
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);
export default axiosClient;
