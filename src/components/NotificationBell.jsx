import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { waitLabel } from '../utils/helpers';

export default function NotificationBell() {
  const { urgentTickets } = useTickets();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function handleOpenTicket(id) {
    setOpen(false);
    navigate(`/tickets/${id}`);
  }

  return (
    <div
      className="bell"
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8z" />
        <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
      </svg>
      {urgentTickets.length > 0 && <span className="badge">{urgentTickets.length}</span>}
      <div className={`notif-dd${open ? ' open' : ''}`}>
        <div className="nd-head">Tiket belum dibalas &gt; 2 jam</div>
        {urgentTickets.length ? (
          urgentTickets.map((t) => (
            <div className="nd-item" key={t.id} onClick={() => handleOpenTicket(t.id)}>
              <b>{t.name}</b>
              {t.kategori} — <span>{waitLabel(t)}</span>
            </div>
          ))
        ) : (
          <div className="nd-empty">Tidak ada tiket mendesak 🎉</div>
        )}
      </div>
    </div>
  );
}
