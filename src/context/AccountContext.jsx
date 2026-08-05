import { createContext, useContext, useEffect, useState } from 'react';
import {
  createAccount as createAccountRequest,
  deleteAccount as deleteAccountRequest,
  getAccounts,
  updateAccount as updateAccountRequest,
} from '../services/accountService';
import { useToast } from './ToastContext';

const AccountContext = createContext(null);

const REFRESH_INTERVAL_MS = 60000;

export function AccountProvider({ children }) {
  const toast = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadAccounts(silent = false) {
      if (!silent) setLoading(true);

      try {
        const data = await getAccounts();
        if (!active) return;
        setAccounts(data);
      } finally {
        if (active && !silent) setLoading(false);
      }
    }

    loadAccounts();

    const timer = setInterval(() => {
      loadAccounts(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  async function saveAccount(id, { name, username, role, password }) {
    if (!name.trim() || !username.trim()) {
      toast('Isi nama dan username dulu ya');
      return false;
    }
    
    try {
      if (id) {
        const updated = await updateAccountRequest(id, {
          name: name.trim(),
          username: username.trim(),
          role,
          password,
        });
        setAccounts((prev) => prev.map((a) => (a.id === id ? updated : a)));
        toast('Akun berhasil diperbarui');
      } else {
        if (!password || password.length < 8) {
          toast('Kata sandi harus minimal 8 karakter');
          return false;
        }
        const created = await createAccountRequest({
          name: name.trim(),
          username: username.trim(),
          role,
          password,
        });
        setAccounts((prev) => [...prev, created]);
        toast('Akun baru ditambahkan');
      }
      return true;
    } catch (error) {
      console.error(error);
      toast('Gagal menyimpan akun. Silakan coba lagi.');
      return false; // Mengembalikan false agar modal tidak tertutup otomatis
    }
  }

  async function removeAccount(id) {
    setLoading(true);
    try {
      await deleteAccountRequest(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      toast('Akun berhasil dihapus');
    } catch (error) {
      console.error(error);
      toast('Akun ini memiliki data terikat dengan tiket dan tidak bisa dihapus.');
    } finally {
      setLoading(false); // Mengembalikan tabel ke normal
    }
  }

  const value = { accounts, loading, saveAccount, removeAccount };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccounts() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccounts harus dipakai di dalam AccountProvider');
  return ctx;
}
