import api from './api';

// Mapper untuk mengubah format dari backend Ed ke format yang dipahami Frontend UI
function mapTicketData(t) {
  if (!t) return null;

  // Konversi status dari backend Ed ke status yang dipakai UI Dashboard kamu
  let mappedStatus = t.status || 'new';
  if (t.status === 'open') mappedStatus = 'new';
  if (t.status === 'in_progress') mappedStatus = 'progress';
  if (t.status === 'resolved') mappedStatus = 'done';

  return {
    ...t,
    id: t.id_ticket || t.id,
    name: t.reporter || t.name || 'Tanpa Nama',
    role: t.reporter_role || t.role || 'mahasiswa',
    kategori: t.category || t.kategori || 'Umum',
    status: mappedStatus,
    description: t.description || '',
    messages: t.messages || [
      {
        who: 'user',
        text: t.description || 'Tidak ada deskripsi pesan.',
        time: t.created_at ? new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      }
    ],
    notes: t.notes || [],
    wait: t.created_at ? Math.floor((new Date() - new Date(t.created_at)) / (1000 * 60)) : 0
  };
}

// Mengambil semua tiket dari backend
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

// Mengambil detail 1 tiket berdasarkan ID
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

// Mengubah status tiket (misal: open -> in_progress -> resolved)
export async function updateTicketStatus(id, status, assignedTo = null) {
  let backendStatus = status;
  if (status === 'new') backendStatus = 'open';
  if (status === 'progress') backendStatus = 'in_progress';
  if (status === 'done') backendStatus = 'resolved';

  const response = await api.put(`/tickets/${id}/status`, {
    status: backendStatus,
    assigned_to: assignedTo,
  });
  return response.data;
}

export async function sendTicketReply(id, text) {
  return Promise.resolve({ success: true });
}

export async function addTicketNote(id, text, author) {
  return Promise.resolve({ success: true });
}