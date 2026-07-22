import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="mark">DS</div>
        <span>DITSINTEK Helpdesk</span>
      </div>

      <div className="nav-label">Ticketing</div>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v5" />
        </svg>
        Antrean Tiket
      </NavLink>

      <div className="nav-divider" />
      <div className="nav-label">Pengetahuan</div>
      <NavLink to="/faq" className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
          <circle cx="12" cy="17" r="0.4" fill="currentColor" />
        </svg>
        Kelola FAQ
      </NavLink>

      {isAdmin && (
        <>
          <div className="nav-divider" />
          <div className="nav-label">Akun</div>
          <NavLink to="/accounts" className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M2.5 19c1.2-3.6 4-5.2 6.5-5.2s5.3 1.6 6.5 5.2" />
              <circle cx="17.5" cy="8.5" r="2.5" />
              <path d="M15.5 13.6c2.1.2 4 1.6 4.9 4.4" />
            </svg>
            Manajemen Akun
          </NavLink>
        </>
      )}

      <div className="nav-item" style={{ marginTop: 'auto' }} onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
          <path d="M15 16l4-4-4-4" />
          <path d="M19 12H9" />
        </svg>
        Keluar
      </div>

      <div className="sidebar-foot">
        <div className="avatar">DP</div>
        <div className="who">
          <b>Dian Pratiwi</b>
          <small>{isAdmin ? 'Admin' : 'Helpdesk'}</small>
        </div>
      </div>
    </div>
  );
}
