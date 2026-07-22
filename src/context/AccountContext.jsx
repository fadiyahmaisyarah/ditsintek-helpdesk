import { createContext, useContext, useEffect, useState } from 'react';
import {
  createAccount as createAccountRequest,
  deleteAccount as deleteAccountRequest,
  getAccounts,
  updateAccount as updateAccountRequest,
} from '../services/accountService';
import { useToast } from './ToastContext';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const toast = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccounts().then((data) => {
      setAccounts(data);
      setLoading(false);
    });
  }, []);

  async function saveAccount(id, { name, email, role, password }) {
    if (!name.trim() || !email.trim()) {
      toast('Isi nama dan email dulu ya');
      return false;
    }
    if (id) {
      const updated = await updateAccountRequest(id, {
        name: name.trim(),
        email: email.trim(),
        role,
        password,
      });
      setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast('Akun berhasil diperbarui');
    } else {
      if (!password || password.length < 8) {
        toast('Kata sandi minimal 8 karakter ya');
        return false;
      }
      const created = await createAccountRequest({
        name: name.trim(),
        email: email.trim(),
        role,
        password,
      });
      setAccounts((prev) => [...prev, created]);
      toast('Akun baru ditambahkan');
    }
    return true;
  }

  async function removeAccount(id) {
    await deleteAccountRequest(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast('Akun dihapus');
  }

  const value = { accounts, loading, saveAccount, removeAccount };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccounts() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccounts harus dipakai di dalam AccountProvider');
  return ctx;
}
