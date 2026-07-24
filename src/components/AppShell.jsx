import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sesuaikan jika ada context auth

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">DS</div>
          <span className="brand-name">DITSINTEK Helpdesk</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">TICKETING</div>
          <div 
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <span className="icon">📋</span>
            <span>Antrean Tiket</span>
          </div>

          <div className="nav-section">PENGETAHUAN</div>
          <div 
            className={`nav-item ${isActive('/faq') ? 'active' : ''}`}
            onClick={() => navigate('/faq')}
          >
            <span className="icon">❓</span>
            <span>Kelola FAQ</span>
          </div>

          {/* BAGIAN INI YANG KURANG DI KODE BARU */}
          <div className="nav-section">AKUN</div>
          <div 
            className={`nav-item ${isActive('/accounts') ? 'active' : ''}`}
            onClick={() => navigate('/accounts')}
          >
            <span className="icon">👥</span>
            <span>Manajemen Akun</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={() => navigate('/login')}>
            <span className="icon">↳</span>
            <span>Keluar</span>
          </div>
          <div className="user-profile">
            <div className="avatar">DP</div>
            <div className="user-info">
              <div className="name">Dian Pratiwi</div>
              <div className="role">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}