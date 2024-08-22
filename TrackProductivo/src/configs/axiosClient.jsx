import axios from "axios";

const axiosClient = axios.create({
<<<<<<< HEAD
    baseURL: 'http://localhost:3000'
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol'); 
    config.headers.token = token;
    config.headers.rol = rol; 
    return config;
});
=======
  baseURL: "http://localhost:3000"
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937

  if (token) {
    config.headers['token'] = token
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;