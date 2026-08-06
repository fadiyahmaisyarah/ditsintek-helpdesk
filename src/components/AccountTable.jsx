import { accRoleLabel } from '../utils/helpers';

export default function AccountTable({ accounts, onEdit, onDelete }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Username</th>
            <th>Peran</th>
            <th style={{ width: 80 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td className="who-cell">
                <b>{a.name}</b>
              </td>
              <td className="mono" style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>
                {a.username}
              </td>
              <td>
                <span className={`role-tag ${a.role === 'admin' ? 'tendik' : 'mhs'}`}>
                  {accRoleLabel(a.role)}
                </span>
              </td>
              <td>
                <div className="faq-actions" style={{ display: 'flex', gap: '8px' }}>
                  <div className="icon-btn" onClick={() => onEdit(a.id)} title="Edit" style={{ cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                  </div>
                  <div className="icon-btn danger" onClick={() => onDelete(a.id)} title="Hapus" style={{ cursor: 'pointer' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}