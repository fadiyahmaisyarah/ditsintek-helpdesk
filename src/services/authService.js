import api from './api';

export async function login({ email, password, role }) {
  try {
    // Panggil API login asli ke backend Railway milik Ed
    const response = await api.post('/auth/login', { email, password, role });
    
    // Kirim data user jika backend bilang password BENAR
    return response.data;
  } catch (error) {
    // Lempar error jika backend bilang password SALAH
    throw new Error(error.response?.data?.message || 'Email atau kata sandi salah!');
  }
}