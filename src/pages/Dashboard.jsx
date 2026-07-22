import AppShell from '../components/AppShell';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import { useTickets } from '../context/TicketContext';

const ROLE_CHIPS = [
  ['all', 'Semua'],
  ['mhs', 'Mahasiswa'],
  ['tendik', 'Tenaga Didik'],
];

export default function Dashboard() {
  const { tickets, filterRole, setFilterRoleChip, search, setSearch } = useTickets();

  const urgentN = tickets.filter((t) => t.status !== 'done' && t.wait >= 120).length;
  const progN = tickets.filter((t) => t.status === 'progress').length;
  const doneN = tickets.filter((t) => t.status === 'done').length;

  return (
    <AppShell>
      <Topbar title="Antrean Tiket" description="Diurutkan dari tiket terbaru — klik header kolom untuk mengurutkan ulang.">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            placeholder="Cari nama, kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Topbar>
      <div className="content">
        <div className="stat-grid">
          <StatCard n={urgentN} label="Belum dibalas > 2 jam" variant="urgent" />
          <StatCard n={progN} label="Sedang diproses" variant="warn" />
          <StatCard n={doneN} label="Selesai (contoh data)" variant="good" />
        </div>
        <div className="panel">
          <div className="panel-head">
            <h3>Semua tiket</h3>
            <div className="filters">
              {ROLE_CHIPS.map(([key, label]) => (
                <div
                  key={key}
                  className={`chip${filterRole === key ? ' on' : ''}`}
                  onClick={() => setFilterRoleChip(key)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <TicketTable />
        </div>
      </div>
    </AppShell>
  );
}
