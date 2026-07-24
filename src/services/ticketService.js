import api from './api';

// Mengambil semua tiket dari backend
export async function getTickets() {
  const response = await api.get('/tickets');
  return response.data?.data || [];
}

// Mengambil detail 1 tiket berdasarkan ID
export async function getTicketById(id) {
  const response = await api.get(`/tickets/${id}`);
  return response.data?.data || null;
}

// Mengubah status tiket (misal: in_progress, resolved, dsb)
export async function updateTicketStatus(id, status, assignedTo = null) {
  const response = await api.put(`/tickets/${id}/status`, {
    status: status,
    assigned_to: assignedTo,
  });
  return response.data;
}

// Catatan: Jika endpoint balasan/notes belum ada di backend Ed, 
// fungsi dummy-nya tetap aman dipanggil tanpa bikin app crash.
export async function sendTicketReply(id, text) {
  return Promise.resolve({ success: true });
}

export async function addTicketNote(id, text, author) {
  return Promise.resolve({ success: true });
}