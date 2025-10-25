import axios from 'axios';
import Cookies from 'js-cookie';

export const http = axios.create({
  // baseURL: import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:3022',
  baseURL: '/api',
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});