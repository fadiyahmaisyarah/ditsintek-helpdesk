import api from './api';

export const login = async (username, password) => {
  try {
   
    const response = await api.post('/authentications', {
      username: String(username),
      password: String(password),
    });

   
    if (response.data && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Terjadi kesalahan pada server' };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};