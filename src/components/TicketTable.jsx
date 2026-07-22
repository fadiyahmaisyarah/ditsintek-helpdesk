import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { roleLabel, statusLabel } from '../utils/helpers';

function SortArrow({ active, dir }) {
  if (!active) return <span className="arrow" />;
  return <span className="arrow">{dir === 'asc' ? '▲' : '▼'}</span>;
}

export default function TicketTable() {
  const { filteredSortedTickets, sortKey, sortDir, setSort } = useTickets();
  const navigate = useNavigate();

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => setSort('id')}>
            ID Tiket <SortArrow active={sortKey === 'id'} dir={sortDir} />
          </th>
          <th onClick={() => setSort('name')}>
            Pengirim <SortArrow active={sortKey === 'name'} dir={sortDir} />
          </th>
          <th>Kategori</th>
          <th onClick={() => setSort('status')}>
            Status <SortArrow active={sortKey === 'status'} dir={sortDir} />
          </th>
          <th>PIC</th>
          <th style={{ width: 36 }} />
        </tr>
      </thead>
      <tbody>
        {filteredSortedTickets.length === 0 ? (
          <tr className="empty-row">
            <td colSpan={6}>Tidak ada tiket yang cocok dengan filter ini.</td>
          </tr>
        ) : (
          filteredSortedTickets.map((t) => (
            <tr className="row-link" key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
              <td className="id-cell">{t.id}</td>
              <td className="who-cell">
                <b>{t.name}</b>
                <span className={`role-tag ${t.role}`}>{roleLabel(t.role)}</span>
              </td>
              <td className="cat-tag">{t.kategori}</td>
              <td>
                <span className={`status-pill ${t.status}`}>{statusLabel(t.status)}</span>
              </td>
              <td className="pic-cell">{t.pic || '—'}</td>
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
  );
}
