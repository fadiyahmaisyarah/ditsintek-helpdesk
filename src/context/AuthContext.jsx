import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';
import { getAccounts } from '../services/accountService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loggingIn, setLoggingIn] = useState(false);

  const isAuthenticated = !!user;

  // Cek apakah user adalah admin berdasarkan role ATAU jika username mengandung kata 'admin'
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin' || (user?.username && user.username.toLowerCase().includes('admin'));

  const login = async (username, password, defaultRole = 'helpdesk') => {
    setLoggingIn(true);
    try {
      const response = await authService.login(username, password);
      const responseUser = response?.data?.user || response?.data?.data || response?.data || {};

      const normalizedUsername = String(username || '').toLowerCase().trim();
      let resolvedRole = String(responseUser.role || responseUser.user_role || '').toLowerCase().trim();

      if (!resolvedRole) {
        try {
          const accounts = await getAccounts();
          const matchedAccount = accounts.find((account) => {
            const accountUsername = String(account?.username || account?.email || '').toLowerCase().trim();
            const accountName = String(account?.name || '').toLowerCase().trim();
            return normalizedUsername && (accountUsername === normalizedUsername || accountName === normalizedUsername);
          });

          resolvedRole = String(matchedAccount?.role || '').toLowerCase().trim();
        } catch (error) {
          resolvedRole = '';
        }
      }

      if (!resolvedRole) {
        resolvedRole = normalizedUsername.includes('admin') ? 'admin' : defaultRole;
      }

      if (normalizedUsername.includes('admin')) {
        resolvedRole = 'admin';
      }

      const userData = {
        id_user: responseUser.id_user || responseUser.id || responseUser.user_id || null,
        username: username,
        name: username,
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
        ...responseUser,
        role: resolvedRole,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, loggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);