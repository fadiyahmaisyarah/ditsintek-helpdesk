// import api from './api';

// Mock login: menyimulasikan panggilan API dengan delay 500ms, sama seperti
// versi HTML/JS aslinya. Ganti body fungsi ini dengan panggilan
// `api.post('/auth/login', { email, password, role })` saat backend siap.
export function login({ email, password, role }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        role: role || 'helpdesk',
        name: role === 'admin' ? 'Dian Pratiwi' : 'Reza Firmansyah',
        email,
      });
    }, 500);
  });
}
