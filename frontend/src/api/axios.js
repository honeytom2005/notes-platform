import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically add token to every request
instance.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

export default instance;