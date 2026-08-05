import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAccounts } from '../services/accountService';
import { accRoleLabel } from '../utils/helpers';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [resolvedName, setResolvedName] = useState('User');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    let active = true;

    async function resolveName() {
      const fallbackName = user?.name || user?.username || 'User';
      const activeUsername = String(user?.username || '').toLowerCase().trim();

      try {
        const accounts = await getAccounts();
        const matchedAccount = accounts.find((account) => {
          const accountUsername = String(account?.username || '').toLowerCase().trim();
          const accountName = String(account?.name || '').toLowerCase().trim();
          const accountId = String(account?.id || '').toLowerCase().trim();

          return (
            activeUsername &&
            (accountUsername === activeUsername || accountName === activeUsername || accountId === activeUsername)
          );
        });

        if (active) {
          setResolvedName(matchedAccount?.name || fallbackName);
        }
      } catch (error) {
        if (active) {
          setResolvedName(fallbackName);
        }
      }
    }

    resolveName();

    return () => {
      active = false;
    };
  }, [user?.username, user?.name]);

  const displayName = resolvedName;
  const displayRole = user?.role ? accRoleLabel(user.role) : (isAdmin ? 'Admin' : 'Helpdesk');
  const avatarText = (displayName || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="mark">DS</div>
        <span>DITSINTEK Helpdesk</span>
        {/* Tombol close khusus tampilan mobile */}
        <button className="close-sidebar-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="nav-label">Ticketing</div>
      <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v5" />
        </svg>
        Antrean Tiket
      </NavLink>

      <div className="nav-divider" />
      <div className="nav-label">Konteks Bot</div>
      <NavLink to="/faq" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
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
          <NavLink to="/accounts" onClick={onClose} className={({ isActive }) => `nav-item${isActive ? ' on' : ''}`}>
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

      <div className="nav-item" style={{ marginTop: 'auto' }} onClick={() => { handleLogout(); onClose(); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
          <path d="M15 16l4-4-4-4" />
          <path d="M19 12H9" />
        </svg>
        Keluar
      </div>

      <div className="sidebar-foot">
        <div className="avatar">{avatarText}</div>
        <div className="who">
          <b>{displayName}</b>
          <small>{displayRole}</small>
        </div>
      </div>
    </div>
  );
}