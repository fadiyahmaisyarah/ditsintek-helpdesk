// Dummy/mock data untuk FAQ.
// Bisa diganti dengan fetch/axios ke REST API nanti (lihat src/services/api.js).
const FAQS = [
  {
    id: 1,
    cat: 'Non Akademik',
    q: 'Bagaimana cara reset password SIA?',
    a: 'Buka sia.usu.ac.id → Lupa Password → masukkan NIM dan email terdaftar → link reset dikirim ke email dalam 5 menit.',
  },
  {
    id: 2,
    cat: 'Akademik',
    q: 'KRS belum bisa diisi, kenapa?',
    a: 'Cek jadwal pengisian KRS di kalender akademik. Jika sudah masuk periode namun masih terkunci, kemungkinan ada tunggakan pembayaran — hubungi bagian keuangan.',
  },
  {
    id: 3,
    cat: 'Lainnya',
    q: 'Cara pinjam ruang rapat / lab?',
    a: 'Ajukan melalui e-office → Peminjaman Fasilitas, minimal H-1. Persetujuan otomatis untuk ruang yang tersedia di jadwal.',
  },
  {
    id: 4,
    cat: 'Non Akademik',
    q: 'Cara melacak status tiket yang sudah dibuat?',
    a: 'Ketik "cek tiket" ke bot Telegram, lalu masukkan ID tiket atau cukup tunggu — bot mengenali otomatis dari akun Telegram yang sama.',
  },
];

export default FAQS;
