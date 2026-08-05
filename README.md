# DITSINTEK Helpdesk

Frontend helpdesk untuk monitoring tiket, FAQ, dan akun internal DITSINTEK. Project ini dibuat dengan React + Vite dan terhubung ke REST API backend.

## Fitur

- Login berbasis API dengan role `admin` dan `helpdesk`.
- Dashboard tiket dengan statistik, filter, pencarian, sorting, dan pagination.
- Detail tiket berisi thread pesan, perubahan status, PIC, dan catatan internal.
- Manajemen FAQ untuk mendukung jawaban bot.
- Manajemen akun khusus admin.
- Notifikasi tiket mendesak.
- Auto-refresh data berkala di dashboard, FAQ, dan akun.
- Session login disimpan di localStorage supaya refresh halaman tidak memutus login.

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Socket.IO Client
- react-loading-skeleton

## Menjalankan Project

```bash
npm install
npm run dev
```

Lalu buka:

```bash
http://localhost:5173
```

Build production:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Konfigurasi API

Project ini memakai backend API di:

```bash
https://helpdesk-ditsintek-backend.vercel.app/api
```

Konfigurasi contoh environment ada di [\.env.example](.env.example), tetapi saat ini `src/services/api.js` masih memakai base URL tersebut secara langsung.

Jika ingin mengganti backend, update file berikut:

- [src/services/api.js](src/services/api.js)

## Struktur Folder

```text
src/
├─ components/   # Komponen UI reusable
├─ context/      # Auth, ticket, FAQ, account, dan toast state
├─ pages/        # Halaman route
├─ services/     # Lapisan API untuk auth, ticket, FAQ, dan account
├─ styles/       # Global stylesheet
└─ utils/        # Helper format dan normalisasi data
```

## Route

| Route | Halaman | Akses |
|---|---|---|
| `/login` | Login | Publik |
| `/dashboard` | Antrean tiket | Login required |
| `/tickets/:id` | Detail tiket | Login required |
| `/faq` | Kelola FAQ | Login required |
| `/accounts` | Manajemen akun | Admin only |

## Alur Login

- User login lewat API.
- Role user diambil dari response backend.
- Jika role belum ada, aplikasi akan mencocokkan data akun dari backend.
- Jika username mengandung kata `admin`, role akan dipaksa menjadi `admin`.
- Data session user disimpan ke localStorage agar refresh tidak otomatis logout.

## Catatan Perilaku UI

- Sidebar hanya dirender sekali lewat `AppShell`.
- Dashboard menampilkan skeleton saat data masih loading.
- Dashboard, FAQ, dan akun melakukan refresh data otomatis setiap 60 detik.
- Detail tiket memakai Socket.IO untuk update pesan baru secara real-time.

## Pengembangan

Jika ingin memperluas project ini, titik utama yang biasanya diubah adalah:

- [src/services/api.js](src/services/api.js) untuk alamat backend.
- [src/context/AuthContext.jsx](src/context/AuthContext.jsx) untuk alur login dan role.
- [src/context/TicketContext.jsx](src/context/TicketContext.jsx) untuk data tiket dan filter.
- [src/context/FaqContext.jsx](src/context/FaqContext.jsx) untuk FAQ.
- [src/context/AccountContext.jsx](src/context/AccountContext.jsx) untuk akun admin.

## Kredensial

Project ini tidak menyertakan kredensial bawaan. Gunakan akun yang tersedia di backend atau environment yang kamu siapkan sendiri.
