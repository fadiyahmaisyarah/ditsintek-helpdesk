import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addTicketNote,
  getTickets,
  getTicketNotes,
  sendTicketReply,
  updateTicketStatus,
} from '../services/ticketService';
import { getAccounts } from '../services/accountService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { normalizeRoleKey, normalizeTicketStatus, isTerminalStatus } from '../utils/helpers';

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const toast = useToast();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    getTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  function setSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function setFilterRoleChip(key) {
    setFilterRole(key);
    if (filterStatus === 'unanswered') setFilterStatus('all');
  }

  const filteredSortedTickets = useMemo(() => {
    let list = tickets.filter((t) => {
      const ticketRole = normalizeRoleKey(t.role);
      const ticketStatus = normalizeTicketStatus(t.status);
      if (filterRole !== 'all' && ticketRole !== filterRole) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterStatus !== 'all' && ticketStatus !== filterStatus) return false;
      const q = search.toLowerCase();
      if (
        q &&
        !(
          t.name.toLowerCase().includes(q) ||
          t.kategori.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    list = [...list].sort((a, b) => {
      let av;
      let bv;
      if (sortKey === 'name') {
        av = a.name;
        bv = b.name;
      } else if (sortKey === 'status') {
        av = a.status;
        bv = b.status;
      } else {
        av = a.id;
        bv = b.id;
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return list;
  }, [tickets, filterRole, filterStatus, search, sortKey, sortDir]);

  const urgentTickets = useMemo(
    () => tickets.filter((t) => !isTerminalStatus(t.status) && t.wait >= 120),
    [tickets]
  );

  function getTicket(id) {
    return tickets.find((t) => t.id === id);
  }

  async function changeStatus(id, newStatus) {
    try {
      await updateTicketStatus(id, newStatus);
      
      // Update state tiket secara manual dengan menimpa properti statusnya saja
      setTickets((prev) => 
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      
      // Gunakan newStatus untuk menampilkan label yang benar di Toast
      const labelStatus = 
        newStatus === 'open' ? 'Open' : 
        newStatus === 'progress' ? 'In Progress' : 
        newStatus === 'resolved' ? 'Resolved' : 'Closed'; 
        
      toast(`Status tiket diubah menjadi "${labelStatus}"`);
    } catch (error) {
      toast('Gagal memperbarui status ke server');
      throw error; 
    }
  }

  async function sendReply(id, text) {
    try {
      if (!text.trim()) return;
      const updated = await sendTicketReply(id, text.trim());
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      toast('Gagal mengirim pesan ke telegram');
      throw error; 
    }}
    

  async function addNote(id, text) {
    const noteText = text.trim();
    if (!noteText) return;

    let idUser = user?.id_user || user?.id || user?.user_id;

    if (!idUser) {
      const accounts = await getAccounts();
      const matchedUser = accounts.find((account) => {
        const currentUsername = String(user?.username || user?.name || '').toLowerCase().trim();
        const accountName = String(account?.name || '').toLowerCase().trim();
        const accountEmail = String(account?.email || '').toLowerCase().trim();
        return currentUsername && (accountName === currentUsername || accountEmail === currentUsername);
      });

      idUser = matchedUser?.id || matchedUser?.id_user || matchedUser?.user_id || null;
    }

    if (!idUser) {
      toast('ID user belum tersedia, coba login ulang atau cek data user');
      return;
    }

    await addTicketNote(id, idUser, noteText);
    toast('Catatan internal disimpan');
  }

  async function getNotes(id) {
    return getTicketNotes(id);
  }

  const value = {
    tickets,
    loading,
    filterRole,
    filterStatus,
    search,
    sortKey,
    sortDir,
    setFilterRole,
    setFilterRoleChip,
    setFilterStatus,
    setSearch,
    setSort,
    filteredSortedTickets,
    urgentTickets,
    getTicket,
    changeStatus,
    sendReply,
    addNote,
    getNotes,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTickets harus dipakai di dalam TicketProvider');
  return ctx;
}