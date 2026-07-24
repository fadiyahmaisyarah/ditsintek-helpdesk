import axios from 'axios';

const api = axios.create({
  baseURL: 'https://helpdesk-ditsintek-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;