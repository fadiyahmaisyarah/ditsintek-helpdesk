import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // isAuthenticated dipisah dari loginRole supaya jelas: role dipilih dulu
  // di form login (Helpdesk DITSINTEK / Admin FAQ), baru berlaku setelah
  // klik "Masuk" — persis seperti alur pada versi HTML aslinya.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginRole, setLoginRole] = useState('helpdesk');
  const [currentUser, setCurrentUser] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  async function login({ email, password, role }) {
    setLoggingIn(true);
    try {
      const user = await loginRequest({ email, password, role });
      setLoginRole(user.role);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }

  const isAdmin = loginRole === 'admin';

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginRole, currentUser, isAdmin, loggingIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
