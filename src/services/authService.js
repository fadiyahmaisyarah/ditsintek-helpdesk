import api from './api';

export async function login({ username, password, role }) {
  try {
    const response = await api.post('/auth/login', { username, password, role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Username atau kata sandi salah!');
  }
}