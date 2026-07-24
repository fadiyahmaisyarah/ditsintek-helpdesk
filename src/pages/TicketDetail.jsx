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
  
  const threadRef = useRef(null);

  const baseTicket = getTicket(id) || tickets[0];

  // Gunakan LocalStorage agar balasan & catatan tidak hilang saat direfresh / ketimpa API
  const storageKeyMsgs = `ticket_msgs_${id}`;
  const storageKeyNotes = `ticket_notes_${id}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKeyMsgs);
    if (saved) return JSON.parse(saved);
    return baseTicket?.messages || [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(storageKeyNotes);
    if (saved) return JSON.parse(saved);
    return baseTicket?.notes || [];
  });

  // Sinkronisasi jika baseTicket berubah
  useEffect(() => {
    if (baseTicket) {
      const savedMsgs = localStorage.getItem(storageKeyMsgs);
      if (!savedMsgs && baseTicket.messages) {
        setMessages(baseTicket.messages);
      }
      const savedNotes = localStorage.getItem(storageKeyNotes);
      if (!savedNotes && baseTicket.notes) {
        setNotes(baseTicket.notes);
      }
    }
  }, [baseTicket, storageKeyMsgs, storageKeyNotes]);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem(storageKeyMsgs, JSON.stringify(messages));
  }, [messages, storageKeyMsgs]);

  useEffect(() => {
    localStorage.setItem(storageKeyNotes, JSON.stringify(notes));
  }, [notes, storageKeyNotes]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!baseTicket) {
    return (
      <AppShell>
        <Topbar title="Tiket" description="—" />
        <div className="content">Memuat tiket...</div>
      </AppShell>
    );
  }

  // Handler Kirim Balasan (Pastikan masuk ke state & tersimpan)
  async function handleSendReply() {
    if (!replyText.trim()) return;

    const newMsg = {
      who: 'staff', // Mengaktifkan balon hijau di kanan
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    const textToSend = replyText;
    setReplyText('');
    showToast('Balasan terkirim ke Telegram');

    try {
      if (sendReply) await sendReply(baseTicket.id, textToSend);
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  // Handler Simpan Catatan Internal
  async function handleAddNote() {
    if (!noteText.trim()) return;

    const newNote = {
      text: noteText,
      author: 'Dian Pratiwi',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes((prev) => [...prev, newNote]);
    const textToSend = noteText;
    setNoteText('');
    showToast('Catatan internal disimpan');

    try {
      if (addNote) await addNote(baseTicket.id, textToSend);
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  return (
    <AppShell>
      <Topbar
        title={baseTicket.id}
        description={
          'Diteruskan dari bot Telegram — ' +
          (baseTicket.status === 'done' ? 'sudah selesai' : 'belum dibalas ' + waitLabel(baseTicket))
        }
      />
      <div className="content">
        <span className="back-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          ← Kembali ke antrean
        </span>
        
        <div className="detail-grid">
          {/* Thread Panel */}
          <div className="thread-panel">
            <div className="thread-head">
              <div>
                <h2>{baseTicket.name}</h2>
                <div className="meta">
                  {roleLabel(baseTicket.role)} · via {baseTicket.source || 'Bot Telegram'}
                </div>
              </div>
              <span className={`status-pill ${baseTicket.status}`}>{statusLabel(baseTicket.status)}</span>
            </div>

            <div className="thread-body" ref={threadRef}>
              {messages.map((m, i) => {
                const cls = m.who === 'user' ? 'user' : m.who === 'bot' ? 'bot' : 'staff';
                return (
                  <div 
                    className={`msg ${cls}`} 
                    key={i}
                    style={cls === 'staff' ? { marginLeft: 'auto', backgroundColor: '#1E3A2B', color: '#fff' } : {}}
                  >
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

          {/* Side Column */}
          <div className="side-col">
            <div className="side-card">
              <h4>DETAIL TIKET</h4>
              <div>
                <div className="kv">
                  <span>Kategori</span>
                  <span><strong>{baseTicket.kategori || baseTicket.category || 'Umum'}</strong></span>
                </div>
                <div className="kv">
                  <span>Peran</span>
                  <span><strong>{roleLabel(baseTicket.role)}</strong></span>
                </div>
                <div className="kv">
                  <span>Dibuat</span>
                  <span>{baseTicket.createdAt || '—'}</span>
                </div>
                <div className="kv">
                  <span>Waktu tunggu</span>
                  <span
                    style={{
                      color:
                        waitClass(baseTicket) === 'urgent'
                          ? 'var(--red)'
                          : waitClass(baseTicket) === 'warn'
                          ? 'var(--amber)'
                          : 'var(--green-mid)',
                      fontWeight: 'bold'
                    }}
                  >
                    {waitLabel(baseTicket)}
                  </span>
                </div>
                <div className="kv">
                  <span>Sumber</span>
                  <span>{baseTicket.source || 'Bot Telegram'}</span>
                </div>
              </div>
            </div>

            <div className="side-card">
              <h4>UBAH STATUS</h4>
              <select
                className="status-select"
                value={baseTicket.status}
                onChange={(e) => changeStatus && changeStatus(baseTicket.id, e.target.value)}
              >
                <option value="new">Baru</option>
                <option value="progress">Sedang diproses</option>
                <option value="done">Selesai</option>
              </select>
            </div>

            <div className="side-card">
              <h4>CATATAN INTERNAL</h4>
              <div className="notes-list" style={{ marginBottom: '12px' }}>
                {notes.length > 0 ? (
                  notes.map((n, i) => (
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