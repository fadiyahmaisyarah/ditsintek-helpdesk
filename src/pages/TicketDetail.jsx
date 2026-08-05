import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Topbar from '../components/Topbar';
import { TicketDetailSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { getAccounts } from '../services/accountService';
import { isTerminalStatus, roleLabel, statusBadgeClass, statusLabel, waitClass, waitLabel } from '../utils/helpers';

function formatIndonesianDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    // Cek apakah tanggal valid
    if (isNaN(date.getTime())) return isoString; 
    
    // Format tanggal: "5 Agustus 2026, 12:46 WIB"
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(date);
  } catch (error) {
    return isoString; // Fallback jika gagal format
  }
}

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, loading, getTicket, getNotes, changeStatus, sendReply, addNote } = useTickets();
  const { user, isAdmin } = useAuth();
  
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000); 
    return () => clearInterval(timer);
  }, []);
  
  const threadRef = useRef(null);

  const baseTicket = getTicket(id) || tickets[0];

  const [localStatus, setLocalStatus] = useState(baseTicket?.status || 'open');

  const [messages, setMessages] = useState([]);

  const [notes, setNotes] = useState([]);

  const resolvedAssigneeName = useMemo(() => {
    if (!baseTicket?.assigned_to) return '';
    const matchedUser = assignableUsers.find((account) => String(account.id) === String(baseTicket.assigned_to));
    return matchedUser?.name || '';
  }, [assignableUsers, baseTicket?.assigned_to]);

  useEffect(() => {
    const fetchRiwayatChat = async () => {
      try {
        const response = await fetch(`https://helpdesk-ditsintek-backend-production.up.railway.app/api/tickets/${id}/messages`);
        const result = await response.json();

        if (result.status === 'success' && result.data) {
          const formattedMessages = result.data.map(msg => ({
            id_message: msg.id_message,
            who: msg.sender_type === 'helpdesk' ? 'staff' : 'user',
            text: msg.message_text,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Gagal memuat riwayat chat:', error);
      }
    };

    fetchRiwayatChat();
  }, [id]);

  useEffect(() => {
    const socket = io('https://helpdesk-ditsintek-backend-production.up.railway.app');

    socket.on('pesan_baru', (dataPesan) => {
      if (dataPesan && (dataPesan.id_ticket === id || dataPesan.ticket_id === id)) {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(m => 
            (m.id_message && m.id_message === dataPesan.id_message) || 
            (m.text === dataPesan.message_text && m.who === (dataPesan.sender_type === 'helpdesk' ? 'staff' : 'user'))
          );
          
          if (isDuplicate) return prevMessages;

          return [...prevMessages, {
            id_message: dataPesan.id_message || null,
            who: dataPesan.sender_type === 'helpdesk' ? 'staff' : 'user',
            text: dataPesan.message_text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }];
        });
      }
    });

    return () => {
      socket.off('pesan_baru');
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (baseTicket) {
      setLocalStatus(baseTicket.status);
    }
  }, [baseTicket?.status]);

  useEffect(() => {
    let active = true;

    async function loadAssignableUsers() {
      try {
        const accounts = await getAccounts();
        const staffUsers = accounts.filter((account) => {
          const role = String(account?.role || '').toLowerCase();
          return role === 'helpdesk' || role === 'admin';
        });

        if (active) {
          setAssignableUsers(staffUsers);
          setSelectedAssignee(baseTicket?.assigned_to || '');
        }
      } catch (error) {
        console.error('Gagal memuat daftar user assign:', error);
        if (active) {
          setAssignableUsers([]);
          setSelectedAssignee(baseTicket?.assigned_to || '');
        }
      }
    }

    loadAssignableUsers();

    return () => {
      active = false;
    };
  }, [baseTicket?.assigned_to]);

  useEffect(() => {
    let active = true;

    async function loadNotes() {
      if (!id) return;

      try {
        const ticketNotes = typeof getNotes === 'function' ? await getNotes(id) : [];
        if (active) {
          setNotes(ticketNotes);
        }
      } catch (error) {
        console.error('Gagal memuat catatan tiket:', error);
        if (active) {
          setNotes(baseTicket?.notes || []);
        }
      }
    }

    loadNotes();

    return () => {
      active = false;
    };
  }, [id, baseTicket?.notes, getNotes]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <>
        <Topbar title="Tiket" description="—" />
        <TicketDetailSkeleton />
      </>
    );
  }

  if (!baseTicket) {
    return (
      <>
        <Topbar title="Tiket" description="—" />
        <div className="content">Tiket tidak ditemukan.</div>
      </>
    );
  }

  async function handleSendReply() {
    if (!replyText.trim()) return;

    const newMsg = {
      who: 'staff',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    const textToSend = replyText;
    setReplyText('');

    try {
      if (sendReply) await sendReply(baseTicket.id, textToSend);
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;

    const newNote = {
      text: noteText,
      author: user?.name || user?.username || 'User',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes((prev) => [...prev, newNote]);
    const textToSend = noteText;
    setNoteText('');

    try {
      if (addNote) await addNote(baseTicket.id, textToSend);
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  async function handleAssignPic() {
    if (!selectedAssignee) return;

    try {
      if (changeStatus) {
        await changeStatus(baseTicket.id, localStatus, selectedAssignee);
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  }

  return (
    <>
      <Topbar
        title={baseTicket.id}
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
              <span className={`status-pill ${statusBadgeClass(localStatus)}`}>{statusLabel(localStatus)}</span>
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
                placeholder="Tulis balasan... (terhubung real-time via Socket.io)"
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
                  <span>{formatIndonesianDate(baseTicket.createdAt || baseTicket.created_at)}</span>
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
              </div>
            </div>

            <div className="side-card">
              <h4>UBAH STATUS</h4>
              <select
                className="status-select"
                value={localStatus}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  setLocalStatus(newStatus);
                  if (changeStatus) {
                    try {
                      await changeStatus(baseTicket.id, newStatus);
                    } catch (err) {
                      console.error('API Error:', err);
                      setLocalStatus(baseTicket.status); 
                    }
                  }
                }}
              >
                <option value="open">Open</option>
                <option value="progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="side-card">
              <h4>Penanggung Jawab (PIC) Tiket</h4>
              <div style={{ marginBottom: isAdmin ? '12px' : '0' }}>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                  PIC saat ini
                </span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--ink)' }}>
                  {resolvedAssigneeName || 'Belum di-assign'}
                </strong>
              </div>
              {isAdmin && (
                <>
                  <select
                    className="status-select"
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                  >
                    <option value="">Pilih PIC</option>
                    {assignableUsers.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} · {account.role}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-outline"
                    onClick={handleAssignPic}
                    disabled={!selectedAssignee}
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    Simpan PIC
                  </button>
                </>
              )}
            </div>

            <div className="side-card">
              <h4>CATATAN INTERNAL</h4>
              <div className="notes-list" style={{ marginBottom: '12px' }}>
                {notes.length > 0 ? (
                  notes.map((n, i) => (
                    <div className="note-item" key={i} style={{ marginBottom: '8px' }}>
                      <div style={{ fontWeight: 500 }}>{n.note_text || n.text}</div>
                      <small style={{ opacity: 0.7, display: 'block', marginTop: '2px' }}>
                        {n.author || 'User'} · {n.time || ''}
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
    </>
  );
}