import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth?.() || {};

  const userRole = user?.role || 'Admin';
  const userName = user?.name || 'Dian Pratiwi';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">DS</div>
          <div>
            <div className="brand-title">DITSINTEK Helpdesk</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <div className="nav-group-label">TICKETING</div>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M3 9h18" />
              </svg>
              <span>Antrean Tiket</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <div className="nav-group-label">PENGETAHUAN</div>
            <NavLink
              to="/faq"
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
              <span>Kelola FAQ</span>
            </NavLink>
          </div>

          <div className="nav-group">
            <div className="nav-group-label">AKUN</div>
            <NavLink
              to="/accounts"
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Manajemen Akun</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Keluar</span>
          </button>

          <div className="user-info">
            <div className="user-avatar">{userInitials}</div>
            <div className="user-detail">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}