import api from './api';
import ACCOUNTS from '../data/accounts';

export function getAccounts() {
  return api.get('/users')
    .then(res => {
      const users = res.data.data || res.data;
      if (!users || !Array.isArray(users)) return ACCOUNTS;
      return users.map(user => ({
        id: user.id_user || user.id,
        name: user.name,
        email: user.username,
        role: user.role,
        active: true
      }));
    })
    .catch(err => {
      console.warn("Gagal ambil dari API database, menggunakan data lokal sementara:", err);
      return ACCOUNTS;
    });
}

export function createAccount({ name, username, email, role, password }) {
  return api.post('/users', { name, username: username || email, password, role })
    .then(res => res.data);
}

export function updateAccount(id, { name, email, role, password }) {
  const payload = {};
  if (password) payload.password = password;
  if (name) payload.name = name;
  if (role) payload.role = role;
  
  return api.put(`/users/${id}`, payload).then(res => res.data);
}

export function deleteAccount(id) {
  return api.delete(`/users/${id}`).then(res => res.data);
}