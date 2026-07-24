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

  const login = async (username, password, role = 'helpdesk') => {
    setLoggingIn(true);
    try {
      const response = await authService.login(username, password);
      
      const userData = {
        username: username,
        role: role,
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
   
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);