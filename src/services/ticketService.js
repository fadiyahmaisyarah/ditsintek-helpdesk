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
  const createdAt = t.created_at || t.createdAt || null;
  const updatedAt = t.updated_at || t.updatedAt || createdAt;

  return {
    ...t,
    id: t.id_ticket || t.id,
    name: t.reporter || t.name || 'Tanpa Nama',
    role: formatRole(t.reporter_role || t.role), // Merapikan role agar balon warna muncul
    kategori: t.category || t.kategori || 'Umum',
    status: mappedStatus,
    assigned_to: t.assigned_to || null,
    assigned_to_name: t.assigned_to_name || t.assignedToName || '',
    created_at: createdAt,
    updated_at: updatedAt,
    description: t.description || '',
    messages: Array.isArray(t.messages) && t.messages.length > 0 ? t.messages : [
      {
        who: 'user',
        text: t.description || 'Tidak ada deskripsi pesan.',
        time: createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      }
    ],
    notes: Array.isArray(t.notes) ? t.notes : [],
    wait: updatedAt ? Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60)) : 0
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
        const accountUsername = String(account?.username || '').toLowerCase().trim();
        return targetId && (accountId === targetId || accountName === targetId || accountUsername === targetId);
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
export async function updateTicketStatus(id, status, assignedTo) {
  try {
    const normalizedStatus = normalizeTicketStatus(status);
    let backendStatus = normalizedStatus;

    if (normalizedStatus === 'open') backendStatus = 'open';
    if (normalizedStatus === 'progress') backendStatus = 'in_progress';
    if (normalizedStatus === 'resolved') backendStatus = 'resolved';
    if (normalizedStatus === 'closed') backendStatus = 'closed';

    const payload = {
      status: backendStatus,
    };

    if (assignedTo !== undefined) {
      payload.assigned_to = assignedTo;
    }

    const response = await api.put(`/tickets/${id}/status`, payload);

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