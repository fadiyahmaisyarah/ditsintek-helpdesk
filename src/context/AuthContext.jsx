import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loggingIn, setLoggingIn] = useState(false);

  const isAuthenticated = !!user;

  // VARIABEL INI YANG KEMAARIN KURANG: Memeriksa apakah role user itu 'admin'
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin';

  const login = async (username, password, role = 'helpdesk') => {
    setLoggingIn(true);
    try {
      const response = await authService.login(username, password);
      
      const userData = {
        username: username,
        role: role, // menyimpan 'admin' atau 'helpdesk'
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
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
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout, loggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);