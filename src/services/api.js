import axios from 'axios';

// Base URL REST API akan diisi oleh tim backend nanti, contoh lewat file .env:
// VITE_API_BASE_URL=https://api.helpdesk.ditsintek.usu.ac.id
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor contoh untuk menyisipkan token auth nanti, misal:
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
