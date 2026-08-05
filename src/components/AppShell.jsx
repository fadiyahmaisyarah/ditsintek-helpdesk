import { useState } from 'react';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      {/* Overlay hitam di background saat sidebar kebuka di HP */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        {/* Tombol Hamburger khusus layar HP/setengah layar */}
        <div className="mobile-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="mobile-title">DITSINTEK Helpdesk</span>
        </div>

        {children}
      </div>
    </div>
  );
}