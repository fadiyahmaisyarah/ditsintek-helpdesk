import api from './api';
import { getAccounts } from './accountService';
import { normalizeRoleKey, normalizeTicketStatus } from '../utils/helpers';

// Helper untuk merapikan nama role agar badge UI/balon warna membalas dengan benar
function formatRole(role) {
  return normalizeRoleKey(role);
}

// Mapper untuk menyelaraskan data backend ke format UI
function mapTicketData(t) {
  if (!t) return null;

  const mappedStatus = normalizeTicketStatus(t.status);

  return {
    ...t,
    id: t.id_ticket || t.id,
    name: t.reporter || t.name || 'Tanpa Nama',
    role: formatRole(t.reporter_role || t.role), // Merapikan role agar balon warna muncul
    kategori: t.category || t.kategori || 'Umum',
    status: mappedStatus,
    description: t.description || '',
    messages: Array.isArray(t.messages) && t.messages.length > 0 ? t.messages : [
      {
        who: 'user',
        text: t.description || 'Tidak ada deskripsi pesan.',
        time: t.created_at ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      }
    ],
    notes: Array.isArray(t.notes) ? t.notes : [],
    wait: t.created_at ? Math.floor((new Date() - new Date(t.created_at)) / (1000 * 60)) : 0
  };
}

// Mengambil semua tiket
export async function getTickets() {
  try {
    const response = await api.get('/tickets');
    const rawData = response.data?.data || [];
    return Array.isArray(rawData) ? rawData.map(mapTicketData) : [];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

// Mengambil detail 1 tiket
export async function getTicketById(id) {
  try {
    const response = await api.get(`/tickets/${id}`);
    const rawData = response.data?.data || null;
    return mapTicketData(rawData);
  } catch (error) {
    console.error('Error fetching ticket detail:', error);
    return null;
  }
}

export async function getTicketNotes(id) {
  try {
    const response = await api.get(`/tickets/${id}/notes`);
    const rawData = response.data?.data || [];
    const accounts = await getAccounts();

    const resolveAuthorName = (idUser) => {
      if (!idUser) return 'User';

      const targetId = String(idUser).toLowerCase().trim();
      const matchedAccount = accounts.find((account) => {
        const accountId = String(account?.id || account?.id_user || account?.user_id || '').toLowerCase().trim();
        const accountName = String(account?.name || '').toLowerCase().trim();
        const accountEmail = String(account?.email || '').toLowerCase().trim();
        return targetId && (accountId === targetId || accountName === targetId || accountEmail === targetId);
      });

      return matchedAccount?.name || 'User';
    };

    return Array.isArray(rawData)
      ? rawData.map((note) => ({
          id_note: note.id_note,
          id_ticket: note.id_ticket,
          id_user: note.id_user,
          text: note.note_text || note.text || '',
          note_text: note.note_text || note.text || '',
          author: resolveAuthorName(note.id_user),
          created_at: note.created_at,
          time: note.created_at
            ? new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
        }))
      : [];
  } catch (error) {
    console.error('Error fetching ticket notes:', error);
    return [];
  }
}

// Ubah Status Tiket
export async function updateTicketStatus(id, status, assignedTo = null) {
  try {
    const normalizedStatus = normalizeTicketStatus(status);
    let backendStatus = normalizedStatus;

    if (normalizedStatus === 'open') backendStatus = 'open';
    if (normalizedStatus === 'progress') backendStatus = 'in_progress';
    if (normalizedStatus === 'resolved') backendStatus = 'resolved';
    if (normalizedStatus === 'closed') backendStatus = 'closed';

    const response = await api.put(`/tickets/${id}/status`, {
      status: backendStatus,
      assigned_to: assignedTo,
    });

    if (response?.data?.data) {
      return mapTicketData(response.data.data);
    }

    return await getTicketById(id);
  } catch (error) {
    console.error('Error updating status:', error);
    return await getTicketById(id);
  }
}

// Kirim Balasan (Diubah menggunakan message_text dan sender_type sesuai backend Ed)
export async function sendTicketReply(id, text) {
  try {
    await api.post(`/tickets/${id}/messages`, { 
      message_text: text,
      sender_type: 'helpdesk' 
    });
    return await getTicketById(id);
  } catch (error) {
    console.error('Error sending reply:', error);
    throw error; 
  }
}

// Tambah Catatan Internal dari backend notes
export async function addTicketNote(id, idUser, noteText) {
  try {
    const response = await api.post(`/tickets/${id}/notes`, {
      id_user: idUser,
      note_text: noteText,
    });

    return response.data?.data || null;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
}