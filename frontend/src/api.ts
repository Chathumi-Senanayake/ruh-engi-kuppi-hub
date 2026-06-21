import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userObj = JSON.parse(userString);
      if (userObj.token) {
        config.headers.Authorization = `Bearer ${userObj.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
