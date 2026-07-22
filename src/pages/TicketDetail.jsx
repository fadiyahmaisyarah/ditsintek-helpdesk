import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Topbar from '../components/Topbar';
import { useTickets } from '../context/TicketContext';
import { roleLabel, statusLabel, waitClass, waitLabel } from '../utils/helpers';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, getTicket, changeStatus, sendReply, addNote } = useTickets();
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const threadRef = useRef(null);

  const ticket = getTicket(id) || tickets[0];

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [ticket?.messages]);

  if (!ticket) {
    return (
      <AppShell>
        <Topbar title="Tiket" description="—" />
        <div className="content">Memuat tiket...</div>
      </AppShell>
    );
  }

  async function handleSendReply() {
    if (!replyText.trim()) return;
    await sendReply(ticket.id, replyText);
    setReplyText('');
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    await addNote(ticket.id, noteText);
    setNoteText('');
  }

  return (
    <AppShell>
      <Topbar
        title={ticket.id}
        description={
          'Diteruskan dari bot Telegram — ' +
          (ticket.status === 'done' ? 'sudah selesai' : 'belum dibalas ' + waitLabel(ticket))
        }
      />
      <div className="content">
        <span className="back-link" onClick={() => navigate('/dashboard')}>
          ← Kembali ke antrean
        </span>
        <div className="detail-grid">
          <div className="thread-panel">
            <div className="thread-head">
              <div>
                <h2>{ticket.name}</h2>
                <div className="meta">
                  {roleLabel(ticket.role)} · via {ticket.source}
                </div>
              </div>
              <span className={`status-pill ${ticket.status}`}>{statusLabel(ticket.status)}</span>
            </div>
            <div className="thread-body" ref={threadRef}>
              {ticket.messages.map((m, i) => {
                const cls = m.who === 'user' ? 'user' : m.who === 'bot' ? 'bot' : 'staff';
                return (
                  <div className={`msg ${cls}`} key={i}>
                    {m.text}
                  </div>
                );
              })}
            </div>
            <div className="reply-box">
              <textarea
                placeholder="Tulis balasan... (akan terkirim ke Telegram melalui webhook)"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="reply-actions">
                <span className="via">Terkirim sebagai pesan bot ke Telegram</span>
                <button className="btn-send" onClick={handleSendReply}>
                  Kirim Balasan
                </button>
              </div>
            </div>
          </div>
          <div className="side-col">
            <div className="side-card">
              <h4>Detail Tiket</h4>
              <div>
                <div className="kv">
                  <span>Kategori</span>
                  <span>{ticket.kategori}</span>
                </div>
                <div className="kv">
                  <span>Peran</span>
                  <span>{roleLabel(ticket.role)}</span>
                </div>
                <div className="kv">
                  <span>Dibuat</span>
                  <span>{ticket.createdAt}</span>
                </div>
                <div className="kv">
                  <span>Waktu tunggu</span>
                  <span
                    style={{
                      color:
                        waitClass(ticket) === 'urgent'
                          ? 'var(--red)'
                          : waitClass(ticket) === 'warn'
                          ? 'var(--amber)'
                          : 'var(--green-mid)',
                    }}
                  >
                    {waitLabel(ticket)}
                  </span>
                </div>
                <div className="kv">
                  <span>Sumber</span>
                  <span>{ticket.source}</span>
                </div>
              </div>
            </div>
            <div className="side-card">
              <h4>Ubah Status</h4>
              <select
                className="status-select"
                value={ticket.status}
                onChange={(e) => changeStatus(ticket.id, e.target.value)}
              >
                <option value="new">Baru</option>
                <option value="progress">Sedang diproses</option>
                <option value="done">Selesai</option>
              </select>
            </div>
            <div className="side-card">
              <h4>Catatan Internal</h4>
              <div>
                {ticket.notes.length ? (
                  ticket.notes.map((n, i) => (
                    <div className="note-item" key={i}>
                      {n.text}
                      <small>
                        {n.author} · {n.time}
                      </small>
                    </div>
                  ))
                ) : (
                  <div className="note-item" style={{ color: 'var(--ink-faint)' }}>
                    Belum ada catatan internal.
                  </div>
                )}
              </div>
              <div className="add-note">
                <textarea
                  placeholder="Tambah catatan untuk tim internal..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button className="btn-outline" onClick={handleAddNote}>
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
