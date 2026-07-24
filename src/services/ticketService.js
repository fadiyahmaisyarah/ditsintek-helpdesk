import api from './api';

// Helper untuk merapikan nama role agar badge UI/balon warna membalas dengan benar
function formatRole(role) {
  if (!role) return 'Mahasiswa';
  const r = role.toString().toLowerCase();
  if (r.includes('tenaga') || r.includes('tendik') || r.includes('staff')) return 'Tenaga Didik';
  if (r.includes('dosen')) return 'Dosen';
  return 'Mahasiswa';
}

// Mapper untuk menyelaraskan data backend ke format UI
function mapTicketData(t) {
  if (!t) return null;

  let mappedStatus = t.status || 'new';
  if (t.status === 'open') mappedStatus = 'new';
  if (t.status === 'in_progress') mappedStatus = 'progress';
  if (t.status === 'resolved') mappedStatus = 'done';

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

// Ubah Status Tiket
export async function updateTicketStatus(id, status, assignedTo = null) {
  try {
    let backendStatus = status;
    if (status === 'new') backendStatus = 'open';
    if (status === 'progress') backendStatus = 'in_progress';
    if (status === 'done') backendStatus = 'resolved';

    await api.put(`/tickets/${id}/status`, {
      status: backendStatus,
      assigned_to: assignedTo,
    });
    
    // Kembalikan detail tiket yang sudah diperbarui agar UI tidak crash
    return await getTicketById(id);
  } catch (error) {
    console.error('Error updating status:', error);
    return await getTicketById(id);
  }
}

// Kirim Balasan
export async function sendTicketReply(id, text) {
  try {
    // Jika backend Ed ada endpoint reply, panggil di sini
    // await api.post(`/tickets/${id}/reply`, { message: text });
    return await getTicketById(id);
  } catch (error) {
    console.error('Error sending reply:', error);
    return await getTicketById(id);
  }
}

// Tambah Catatan Internal
export async function addTicketNote(id, text, author) {
  try {
    // Jika backend Ed ada endpoint notes, panggil di sini
    return await getTicketById(id);
  } catch (error) {
    console.error('Error adding note:', error);
    return await getTicketById(id);
  }
}