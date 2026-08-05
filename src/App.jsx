import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import { FaqProvider } from './context/FaqContext';
import { AccountProvider } from './context/AccountContext';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell'; // <-- 1. Tambahkan import AppShell
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import Faq from './pages/Faq';
import Accounts from './pages/Accounts';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TicketProvider>
          <FaqProvider>
            <AccountProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  
                  {/* 2. Bungkus halaman-halaman di bawah dengan <AppShell> */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <AppShell>
                          <Dashboard />
                        </AppShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tickets/:id"
                    element={
                      <ProtectedRoute>
                        <AppShell>
                          <TicketDetail />
                        </AppShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <ProtectedRoute>
                        <AppShell>
                          <Faq />
                        </AppShell>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/accounts"
                    element={
                      <ProtectedRoute>
                        <AppShell>
                          <Accounts />
                        </AppShell>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </BrowserRouter>
              <ToastContainer />
            </AccountProvider>
          </FaqProvider>
        </TicketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}