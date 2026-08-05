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

const REFRESH_INTERVAL_MS = 60000;

export function TicketProvider({ children }) {
  const toast = useToast();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPic, setFilterPic] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    let active = true;

    async function loadTickets(silent = false) {
      if (!silent) setLoading(true);

      try {
        const data = await getTickets();
        if (!active) return;
        setTickets(data);
      } finally {
        if (active && !silent) setLoading(false);
      }
    }

    loadTickets();

    const timer = setInterval(() => {
      loadTickets(true);
    }, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
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

  function setFilterPicChip(value) {
    setFilterPic(value);
  }

  const filteredSortedTickets = useMemo(() => {
    let list = tickets.filter((t) => {
      const ticketRole = normalizeRoleKey(t.role);
      const ticketStatus = normalizeTicketStatus(t.status);
      if (filterRole !== 'all' && ticketRole !== filterRole) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterStatus !== 'all' && ticketStatus !== filterStatus) return false;
      if (filterPic !== 'all' && String(t.assigned_to_name || t.pic || '').toLowerCase() !== filterPic) return false;
      const q = search.toLowerCase();
      if (
        q &&
        !(
          t.name.toLowerCase().includes(q) ||
          t.kategori.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          String(t.assigned_to_name || t.pic || '').toLowerCase().includes(q)
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
      } else if (sortKey === 'created_at') {
        av = new Date(a.created_at || 0).getTime();
        bv = new Date(b.created_at || 0).getTime();
      } else if (sortKey === 'updated_at') {
        av = new Date(a.updated_at || 0).getTime();
        bv = new Date(b.updated_at || 0).getTime();
      } else if (sortKey === 'wait') {
        av = a.wait || 0;
        bv = b.wait || 0;
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
  }, [tickets, filterRole, filterStatus, filterPic, search, sortKey, sortDir]);

  const urgentTickets = useMemo(
    () => tickets.filter((t) => !isTerminalStatus(t.status) && t.wait >= 120),
    [tickets]
  );

  function getTicket(id) {
    return tickets.find((t) => t.id === id);
  }

  async function changeStatus(id, newStatus, assignedTo = null) {
    try {
      const currentTicket = tickets.find((ticket) => ticket.id === id);
      const nextAssignedTo = assignedTo !== null ? assignedTo : currentTicket?.assigned_to;
      const updated = await updateTicketStatus(id, newStatus, nextAssignedTo);
      
      // Update state tiket secara manual dengan menimpa status dan PIC jika ada
      setTickets((prev) => 
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...updated,
                status: updated?.status || newStatus,
                assigned_to: updated?.assigned_to ?? nextAssignedTo ?? t.assigned_to,
              }
            : t
        )
      );
      
      const labelStatus =
        newStatus === 'open'
          ? 'Open'
          : newStatus === 'progress'
            ? 'In Progress'
            : newStatus === 'resolved'
              ? 'Resolved'
              : 'Closed';

      const currentStatus = normalizeTicketStatus(currentTicket?.status);
      const nextStatus = normalizeTicketStatus(newStatus);

      if (assignedTo !== null && currentStatus === nextStatus) {
        toast('PIC tiket berhasil diperbarui');
      } else if (assignedTo !== null) {
        toast(`Status tiket dan PIC diubah menjadi "${labelStatus}"`);
      } else {
        toast(`Status tiket diubah menjadi "${labelStatus}"`);
      }
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
        const accountUsername = String(account?.username || '').toLowerCase().trim();
        return currentUsername && (accountName === currentUsername || accountUsername === currentUsername);
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
    filterPic,
    search,
    sortKey,
    sortDir,
    setFilterRole,
    setFilterRoleChip,
    setFilterStatus,
    setFilterPic,
    setFilterPicChip,
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