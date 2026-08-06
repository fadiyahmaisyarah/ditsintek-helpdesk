import { useEffect, useMemo, useState } from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import TicketTable from '../components/TicketTable';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { useTickets } from '../context/TicketContext';
import { normalizeTicketStatus } from '../utils/helpers';

const ROLE_CHIPS = [
  ['all', 'Semua'],
  ['mhs', 'Mahasiswa'],
  ['tendik', 'Tendik'],
  ['dosen', 'Dosen'],
];

const STATUS_CHIPS = [
  ['all', 'Semua Status'],
  ['open', 'Open'],
  ['progress', 'In Progress'],
  ['resolved', 'Resolved'],
];

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
  const {
    tickets,
    loading,
    filterRole,
    filterStatus,
    filterPic,
    setFilterRoleChip,
    setFilterStatus,
    setFilterPicChip,
    search,
    setSearch,
    filteredSortedTickets,
  } = useTickets();
  const [currentPage, setCurrentPage] = useState(1);

  const picOptions = useMemo(() => {
    const names = new Map();
    tickets.forEach((ticket) => {
      const name = ticket.assigned_to_name || ticket.pic;
      if (!name) return;
      const key = String(name).toLowerCase().trim();
      if (!names.has(key)) names.set(key, name);
    });

    return Array.from(names.entries()).map(([value, label]) => ({ value, label }));
  }, [tickets]);

  const openN = tickets.filter((t) => normalizeTicketStatus(t.status) === 'open').length;
  const inprogressN = tickets.filter((t) => normalizeTicketStatus(t.status) === 'progress').length;
  const resolvedN = tickets.filter((t) => normalizeTicketStatus(t.status) === 'resolved').length;
  const totalPages = Math.max(1, Math.ceil(filteredSortedTickets.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSortedTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSortedTickets, currentPage]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  if (loading) {
    return (
      <>
        <Topbar title="Antrean Tiket" description="Diurutkan dari tiket terbaru — klik header kolom untuk mengurutkan ulang." />
        <DashboardSkeleton />
      </>
    );
  }
  return (
    <>
      <Topbar title="Antrean Tiket" description="Diurutkan dari tiket terbaru — klik header kolom untuk mengurutkan ulang.">
        <div className="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            placeholder="Cari nama, PIC, ID tiket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Topbar>
      <div className="content">
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <StatCard n={openN} label="Open" variant="urgent" />
          <StatCard n={inprogressN} label="In Progress" variant="warn" />
          <StatCard n={resolvedN} label="Resolved" variant="good" />
        </div>
        <div className="panel">
          <div className="panel-head">
            <div className="panel-head-left">
              <h3>Semua tiket</h3>
              <div className="filters filters-chips">
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
            <div className="filters filters-selects">
              <label className="filter-select-wrap">
                <span>Status</span>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  {STATUS_CHIPS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-select-wrap">
                <span>PIC</span>
                <select value={filterPic} onChange={(e) => setFilterPicChip(e.target.value)}>
                  <option value="all">Semua PIC</option>
                  {picOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <TicketTable tickets={paginatedTickets} />
          {filteredSortedTickets.length > 0 && (
            <div className="faq-pagination-wrap">
              <div className="faq-pagination" role="navigation" aria-label="Pagination tiket">
                <button className="page-nav-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Prev
                </button>

                {pageNumbers.map((page, index) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={`page-number-btn${page === currentPage ? ' active' : ''}`}
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                )}

                <button className="page-nav-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}