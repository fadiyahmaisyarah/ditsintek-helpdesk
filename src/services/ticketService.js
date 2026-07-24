import api from './api';

// Fungsi helper untuk menyelaraskan nama field dari backend Ed ke frontend UI
function mapTicketData(t) {
  if (!t) return null;
  return {
    ...t,
    id: t.id_ticket || t.id,          // Mengubah id_ticket menjadi id agar link /tickets/:id jalan
    name: t.reporter || t.name,        // Mengubah reporter menjadi name
    role: t.reporter_role || t.role,   // Mengubah reporter_role menjadi role
    kategori: t.category || t.kategori,// Mengubah category menjadi kategori
    status: t.status || 'open',
  };
}

// Mengambil semua tiket dari backend
export async function getTickets() {
  const response = await api.get('/tickets');
  const rawData = response.data?.data || [];
  
  // Mapping array tiket agar properti sesuai dengan UI
  return rawData.map(mapTicketData);
}

// Mengambil detail 1 tiket berdasarkan ID
export async function getTicketById(id) {
  const response = await api.get(`/tickets/${id}`);
  const rawData = response.data?.data || null;
  
  return mapTicketData(rawData);
}

// Mengubah status tiket
export async function updateTicketStatus(id, status, assignedTo = null) {
  const response = await api.put(`/tickets/${id}/status`, {
    status: status,
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