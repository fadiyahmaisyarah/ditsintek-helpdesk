import api from './api';
import ACCOUNTS from '../data/accounts';

// Fungsi bantuan. Kita tambahkan parameter 'submittedData' sebagai fallback 
// jika API hanya merespons status 200/sukses tanpa data user utuh.
const normalizeUser = (user, submittedData = {}) => ({
  id: user.id_user || user.id || submittedData.id,
  name: user.name || submittedData.name,
  username: user.username || submittedData.username,
  role: user.role || submittedData.role,
  active: true
});

export function getAccounts() {
  return api.get('/users')
    .then(res => {
      const users = res.data.data || res.data;
      if (!users || !Array.isArray(users)) return ACCOUNTS;
      // Saat get, tidak ada submittedData
      return users.map(user => normalizeUser(user));
    })
    .catch(err => {
      console.warn("Gagal ambil dari API database, menggunakan data lokal sementara:", err);
      return ACCOUNTS;
    });
}

export function createAccount({ name, username, role, password }) {
  // Hapus referensi email dari payload API
  return api.post('/users', { name, username, password, role })
    .then(res => {
      const user = res.data.data || res.data || {};
      // Kita injeksi data yang kita kirim ke normalizeUser agar langsung muncul di tabel
      return normalizeUser(user, { name, username, role }); 
    });
}

export function updateAccount(id, { name, username, role, password }) {
  const payload = {};
  if (password) payload.password = password;
  if (name) payload.name = name;
  if (username) payload.username = username; // Pastikan username masuk payload
  if (role) payload.role = role;
  
  return api.put(`/users/${id}`, payload).then(res => {
      const user = res.data.data || res.data || {};
      // Injeksi data agar UI tabel otomatis memperbarui teks tanpa perlu refresh
      return normalizeUser(user, { id, name, username, role });
  });
}

export function deleteAccount(id) {
  return api.delete(`/users/${id}`).then(res => res.data);
}