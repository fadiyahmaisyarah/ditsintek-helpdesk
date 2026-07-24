import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // DIBUAT DUA PARAMETER TERPISAH: username dan password
  const login = async (username, password) => {
    setLoggingIn(true);
    try {
      const response = await authService.login(username, password);
      
      const userData = response?.data || { username, role: 'helpdesk' };
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
    <AuthContext.Provider value={{ user, login, logout, loggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);