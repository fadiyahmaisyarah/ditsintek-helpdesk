import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { formatDateTime, formatRelativeDuration, roleLabel, statusBadgeClass, statusLabel } from '../utils/helpers';

function SortArrow({ active, dir }) {
  if (!active) return <span className="arrow" />;
  return <span className="arrow">{dir === 'asc' ? '▲' : '▼'}</span>;
}

function SortHeader({ label, active, dir, onClick, width }) {
  return (
    <th style={width ? { width } : undefined}>
      <button type="button" className={`sort-btn${active ? ' active' : ''}`} onClick={onClick}>
        <span>{label}</span>
        <span className="sort-indicator">
          {active ? <SortArrow active dir={dir} /> : <span className="sort-hint">↕</span>}
        </span>
      </button>
    </th>
  );
}

export default function TicketTable({ tickets: ticketsProp }) {
  const { filteredSortedTickets, sortKey, sortDir, setSort } = useTickets();
  const navigate = useNavigate();
  const ticketsToRender = ticketsProp ?? filteredSortedTickets;

  const getRoleClass = (role) => {
    if (!role) return 'mhs';
    const r = String(role).toLowerCase();
    if (r.includes('tendik') || r.includes('tenaga') || r.includes('dosen')) {
      return 'tendik';
    }
    return 'mhs';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr>
            <SortHeader label="ID Tiket" active={sortKey === 'id'} dir={sortDir} onClick={() => setSort('id')} width={96} />
            <SortHeader label="Pengirim" active={sortKey === 'name'} dir={sortDir} onClick={() => setSort('name')} />
            <SortHeader label="Status" active={sortKey === 'status'} dir={sortDir} onClick={() => setSort('status')} width={120} />
            <th style={{ width: 170 }}>PIC</th>
            <SortHeader label="Waktu Diajukan" active={sortKey === 'created_at'} dir={sortDir} onClick={() => setSort('created_at')} width={180} />
            <SortHeader label="Waktu Tunggu" active={sortKey === 'wait'} dir={sortDir} onClick={() => setSort('wait')} width={140} />
            <th style={{ width: 36 }} />
          </tr>
        </thead>
        <tbody>
          {ticketsToRender.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={7}>Tidak ada tiket yang cocok dengan filter ini.</td>
            </tr>
          ) : (
            ticketsToRender.map((t) => (
              <tr className="row-link" key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
                <td className="id-cell id-cell-tight">{t.id}</td>
                <td className="who-cell">
                  <b>{t.name}</b>
                  <span className={`role-tag ${getRoleClass(t.role)}`}>
                    {roleLabel(t.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${statusBadgeClass(t.status)}`}>{statusLabel(t.status)}</span>
                </td>
                <td className="pic-cell">{t.assigned_to_name || t.pic || '—'}</td>
                <td className="time-cell">{formatDateTime(t.created_at)}</td>
                <td className="time-cell">{formatRelativeDuration(t.updated_at)}</td>
                <td>
                  <div
                    className="detail-arrow"
                    title="Lihat detail tiket"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tickets/${t.id}`);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}