import axios from 'axios';

// Tetap tambahkan https:// 
const BASE_URL = 'https://helpdesk-ditsintek-backend-production.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;