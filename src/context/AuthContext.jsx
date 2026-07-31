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

  // Cek apakah user adalah admin berdasarkan role ATAU jika username mengandung kata 'admin'
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin' || (user?.username && user.username.toLowerCase().includes('admin'));

  const login = async (username, password, defaultRole = 'helpdesk') => {
    setLoggingIn(true);
    try {
      const response = await authService.login(username, password);
      
      // Deteksi otomatis: Jika username mengandung kata 'admin', tetapkan role sebagai 'admin'
      const assignedRole = username.toLowerCase().includes('admin') ? 'admin' : defaultRole;

      const userData = {
        username: username,
        name: username,
        role: assignedRole, // Otomatis jadi 'admin' jika username-nya ada kata admin
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