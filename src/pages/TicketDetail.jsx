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
  const [toastMessage, setToastMessage] = useState('');
  
  // State lokal untuk balasan dan catatan agar langsung tampil di UI
  const [localMessages, setLocalMessages] = useState([]);
  const [localNotes, setLocalNotes] = useState([]);
  
  const threadRef = useRef(null);

  const ticket = getTicket(id) || tickets[0];

  // Sinkronisasi data awal dari Context/Backend ke State Lokal
  useEffect(() => {
    if (ticket) {
      setLocalMessages(ticket.messages || []);
      setLocalNotes(ticket.notes || []);
    }
  }, [ticket]);

  // Auto scroll ke paling bawah chat setiap ada pesan baru
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Helper untuk menampilkan notifikasi Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  if (!ticket) {
    return (
      <AppShell>
        <Topbar title="Tiket" description="—" />
        <div className="content">Memuat tiket...</div>
      </AppShell>
    );
  }

  // Handler Kirim Balasan
  async function handleSendReply() {
    if (!replyText.trim()) return;

    const newMsg = {
      who: 'staff', // Balon kanan untuk admin/staff
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state lokal secara instan
    setLocalMessages((prev) => [...prev, newMsg]);

    const textToSend = replyText;
    setReplyText('');
    showToast('Balasan terkirim ke Telegram');

    // Panggil API di background
    try {
      if (sendReply) await sendReply(ticket.id, textToSend);
    } catch (err) {
      console.error('Error sending reply to backend:', err);
    }
  }

  // Handler Simpan Catatan Internal
  async function handleAddNote() {
    if (!noteText.trim()) return;

    const newNote = {
      text: noteText,
      author: 'Dian Pratiwi', // Nama Admin Helpdesk
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state lokal secara instan
    setLocalNotes((prev) => [...prev, newNote]);

    const textToSend = noteText;
    setNoteText('');
    showToast('Catatan internal disimpan');

    // Panggil API di background
    try {
      if (addNote) await addNote(ticket.id, textToSend);
    } catch (err) {
      console.error('Error adding note to backend:', err);
    }
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
        <span className="back-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          ← Kembali ke antrean
        </span>
        
        <div className="detail-grid">
          {/* Thread Panel / Kolom Chat Utama */}
          <div className="thread-panel">
            <div className="thread-head">
              <div>
                <h2>{ticket.name}</h2>
                <div className="meta">
                  {roleLabel(ticket.role)} · via {ticket.source || 'Bot Telegram'}
                </div>
              </div>
              <span className={`status-pill ${ticket.status}`}>{statusLabel(ticket.status)}</span>
            </div>

            <div className="thread-body" ref={threadRef}>
              {localMessages && localMessages.length > 0 ? (
                localMessages.map((m, i) => {
                  const cls = m.who === 'user' ? 'user' : m.who === 'bot' ? 'bot' : 'staff';
                  return (
                    <div className={`msg ${cls}`} key={i}>
                      {m.text}
                    </div>
                  );
                })
              ) : (
                <div className="msg user">{ticket.description || 'Tidak ada isi pesan.'}</div>
              )}
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

          {/* Kolom Kanan / Detail & Actions */}
          <div className="side-col">
            <div className="side-card">
              <h4>DETAIL TIKET</h4>
              <div>
                <div className="kv">
                  <span>Kategori</span>
                  <span><strong>{ticket.kategori || ticket.category || 'Umum'}</strong></span>
                </div>
                <div className="kv">
                  <span>Peran</span>
                  <span><strong>{roleLabel(ticket.role)}</strong></span>
                </div>
                <div className="kv">
                  <span>Dibuat</span>
                  <span>{ticket.createdAt || '—'}</span>
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
                      fontWeight: 'bold'
                    }}
                  >
                    {waitLabel(ticket)}
                  </span>
                </div>
                <div className="kv">
                  <span>Sumber</span>
                  <span>{ticket.source || 'Bot Telegram'}</span>
                </div>
              </div>
            </div>

            <div className="side-card">
              <h4>UBAH STATUS</h4>
              <select
                className="status-select"
                value={ticket.status}
                onChange={(e) => changeStatus && changeStatus(ticket.id, e.target.value)}
              >
                <option value="new">Baru</option>
                <option value="progress">Sedang diproses</option>
                <option value="done">Selesai</option>
              </select>
            </div>

            <div className="side-card">
              <h4>CATATAN INTERNAL</h4>
              <div className="notes-list" style={{ marginBottom: '12px' }}>
                {localNotes && localNotes.length > 0 ? (
                  localNotes.map((n, i) => (
                    <div className="note-item" key={i} style={{ marginBottom: '8px' }}>
                      <div style={{ fontWeight: 500 }}>{n.text}</div>
                      <small style={{ opacity: 0.7, display: 'block', marginTop: '2px' }}>
                        {n.author || 'Dian Pratiwi'} · {n.time || ''}
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
                <button className="btn-outline" onClick={handleAddNote} style={{ marginTop: '8px', width: '100%' }}>
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E3A2B',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 9999
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </AppShell>
  );
}