import axios from 'axios';

// Create an axios instance with a base URL matching your backend
const api = axios.create({
  baseURL: 'http://localhost:5001', // your backend
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
