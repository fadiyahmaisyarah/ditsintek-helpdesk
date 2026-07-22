# DITSINTEK Helpdesk — Dashboard (React + Vite)

Frontend dashboard monitoring tiket helpdesk DITSINTEK, dikonversi dari HTML/CSS/JS
statis menjadi aplikasi React (Vite). **Tidak ada backend/database** di project ini —
seluruh data masih dummy/mock dan disusun agar mudah disambungkan ke REST API oleh
tim backend nantinya.

## Menjalankan project

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Login dengan email & password apa saja (mock login,
tidak divalidasi ke server) — pilih peran "Helpdesk DITSINTEK" atau "Admin FAQ" dulu
sebelum klik Masuk.

Build production:

```bash
npm run build
npm run preview
```

## Struktur folder

```
src/
├─ components/     # Komponen UI reusable (Sidebar, Topbar, Modal, Table, dll)
├─ pages/          # Satu file per halaman/route (Login, Dashboard, TicketDetail, Faq, Accounts)
├─ context/        # State management global (React Context + useState/useEffect)
│  ├─ AuthContext.jsx      # Status login & peran (helpdesk/admin)
│  ├─ TicketContext.jsx    # Daftar tiket, filter, sort, search, CRUD tiket
│  ├─ FaqContext.jsx       # Daftar FAQ + CRUD
│  ├─ AccountContext.jsx   # Daftar akun (khusus admin) + CRUD
│  └─ ToastContext.jsx     # Notifikasi toast global
├─ services/       # Lapisan pemanggilan data — SEKARANG baca dari data dummy,
│  │                 tapi sudah berbentuk fungsi async & ada komentar contoh
│  │                 pemanggilan axios, tinggal diaktifkan saat backend siap.
│  ├─ api.js               # Instance axios (baseURL dari VITE_API_BASE_URL)
│  ├─ ticketService.js
│  ├─ faqService.js
│  ├─ accountService.js
│  └─ authService.js
├─ data/           # Data dummy/mock (tickets.js, faqs.js, accounts.js)
├─ utils/          # Helper murni (format waktu tunggu, label status, dsb)
├─ styles/global.css  # Seluruh CSS asli (desain, warna, animasi) dipindahkan apa adanya
├─ App.jsx         # Routing (react-router-dom) + susunan Context Provider
└─ main.jsx        # Entry point
```

## Menyambungkan ke REST API nanti

1. Isi `VITE_API_BASE_URL` di file `.env` (contoh ada di `.env.example`).
2. Di tiap file `src/services/*.js`, ganti isi fungsi dari membaca array dummy
   menjadi memanggil `api.get/post/put/delete(...)` — contoh baris kode sudah
   dituliskan sebagai komentar di setiap fungsi.
3. Karena semua fungsi service sudah berbentuk `async`/`Promise`, komponen dan
   Context **tidak perlu diubah sama sekali** — cukup ganti isi service-nya saja.

## Halaman & Route

| Route            | Halaman                          | Akses          |
|-------------------|-----------------------------------|----------------|
| `/login`          | Login (pilih peran + form)        | Publik         |
| `/dashboard`       | Antrean Tiket                     | Login required |
| `/tickets/:id`     | Detail Tiket (thread, balas, catatan) | Login required |
| `/faq`             | Kelola FAQ                        | Login required |
| `/accounts`        | Manajemen Akun                    | Admin only     |

## Catatan

- Desain, warna, layout, dan animasi dipertahankan 100% dari versi HTML asli
  (lihat `src/styles/global.css`).
- Data (tiket, FAQ, akun) masih dummy dan akan reset setiap reload halaman.
- Login juga masih mock (delay 500ms, tanpa validasi kredensial ke server).
