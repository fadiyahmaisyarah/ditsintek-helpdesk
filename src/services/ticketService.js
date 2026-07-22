import TICKETS from '../data/tickets';
// import api from './api';

// Semua fungsi di bawah ini sengaja berbentuk async (mengembalikan Promise)
// walaupun saat ini cuma membaca/mengubah array dummy di memori. Tujuannya
// supaya ketika backend sudah siap, pemanggil (Context/komponen) TIDAK perlu
// diubah — cukup ganti isi fungsi ini jadi `return api.get('/tickets')` dsb.

let _tickets = TICKETS;

export function getTickets() {
  // return api.get('/tickets').then(res => res.data);
  return Promise.resolve(_tickets);
}

export function getTicketById(id) {
  // return api.get(`/tickets/${id}`).then(res => res.data);
  return Promise.resolve(_tickets.find((t) => t.id === id));
}

export function updateTicketStatus(id, status) {
  // return api.patch(`/tickets/${id}/status`, { status }).then(res => res.data);
  _tickets = _tickets.map((t) => (t.id === id ? { ...t, status, wait: status === 'done' ? 0 : t.wait } : t));
  return Promise.resolve(_tickets.find((t) => t.id === id));
}

export function sendTicketReply(id, text) {
  // return api.post(`/tickets/${id}/messages`, { text }).then(res => res.data);
  _tickets = _tickets.map((t) => {
    if (t.id !== id) return t;
    const messages = [...t.messages, { who: 'staff', text }];
    const status = t.status === 'new' ? 'progress' : t.status;
    return { ...t, messages, status };
  });
  return Promise.resolve(_tickets.find((t) => t.id === id));
}

export function addTicketNote(id, text, author) {
  // return api.post(`/tickets/${id}/notes`, { text }).then(res => res.data);
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  _tickets = _tickets.map((t) => {
    if (t.id !== id) return t;
    return { ...t, notes: [...t.notes, { text, author, time }] };
  });
  return Promise.resolve(_tickets.find((t) => t.id === id));
}
