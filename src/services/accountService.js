import ACCOUNTS from '../data/accounts';
// import api from './api';

let _accounts = ACCOUNTS;

export function getAccounts() {
  // return api.get('/accounts').then(res => res.data);
  return Promise.resolve(_accounts);
}

export function createAccount({ name, email, role, password }) {
  // return api.post('/accounts', { name, email, role, password }).then(res => res.data);
  const newId = Math.max(0, ..._accounts.map((a) => a.id)) + 1;
  const newAccount = { id: newId, name, email, role, active: true, password };
  _accounts = [..._accounts, newAccount];
  return Promise.resolve(newAccount);
}

export function updateAccount(id, { name, email, role, password }) {
  // return api.put(`/accounts/${id}`, { name, email, role, password }).then(res => res.data);
  _accounts = _accounts.map((a) => {
    if (a.id !== id) return a;
    return { ...a, name, email, role, ...(password ? { password } : {}) };
  });
  return Promise.resolve(_accounts.find((a) => a.id === id));
}

export function deleteAccount(id) {
  // return api.delete(`/accounts/${id}`);
  _accounts = _accounts.filter((a) => a.id !== id);
  return Promise.resolve(true);
}
