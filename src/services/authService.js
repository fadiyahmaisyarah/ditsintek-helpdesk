import api from './api';

export const login = async (username, password, role) => {
  try {
    const response = await api.post('/api/login', {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Terjadi kesalahan pada server' };
  }
};