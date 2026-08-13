# My Skill Web

Frontend React untuk **My Skill**, platform pembelajaran keahlian SMK. Satu aplikasi web melayani dua peran: **siswa** (belajar konten, bookmark, profil) dan **admin** (kelola konten). UI berbahasa Indonesia.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- API bersama yang berjalan dari `../api` (lihat kontrak API di `../docs/api-contract.md`)

## Setup Lokal

```bash
npm install
cp .env.example .env
npm run dev
```

Web app berjalan di `http://localhost:5173`.

## Environment

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/api` | Base URL API bersama |
| `VITE_GA_ID` | kosong | Google Analytics 4 measurement ID (opsional) |

Analitik nonaktif kalau `VITE_GA_ID` kosong. Vite meng-expose environment variables saat build — jangan taruh secret di file ini.

## Scripts

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan Vite dev server |
| `npm run build` | Build untuk produksi |
| `npm run preview` | Preview build produksi secara lokal |
| `npm test` | Jalankan unit & integration test frontend (Jest) |
| `npm run test:watch` | Jalankan Jest dalam watch mode |

## Rute

### Publik
- `/login` - masuk
- `/register` - daftar akun siswa

### Dilindungi (perlu login — siswa atau admin)
- `/` - beranda dengan sapaan, kategori, dan konten terbaru
- `/konten` - daftar konten dengan search, filter kategori & tipe, dan pagination
- `/konten/:id` - detail konten (artikel / video)
- `/bookmark` - konten tersimpan
- `/profile` - profil pengguna

### Khusus admin (role `admin`)
- `/admin/konten` - daftar semua konten dengan toggle terbit/nonaktif
- `/admin/konten/baru` - buat konten baru
- `/admin/konten/:id/edit` - edit konten

Rute lain menampilkan halaman 404. Semua rute konten dilindungi `ProtectedRoute`; rute admin dilindungi `AdminRoute` (redirect ke `/login` bila belum login, ke `/konten` bila bukan admin).

## Auth & Sesi

- Sesi disimpan di localStorage dengan key `myskill_token` (`{ token, user }`).
- Axios client menambahkan header `Authorization: Bearer <token>` ke setiap request.
- Respons 401 dari API membersihkan sesi dan mengarahkan kembali ke `/login` (interceptor `myskill:unauthorized`).

## Konten

- Kategori tetap: `Otomotif`, `Elektronika`, `Kelistrikan`, `Bangunan`, `Pemesinan & Pengelasan`.
- Tipe konten: `artikel` (teks `body` ditampilkan `white-space: pre-wrap`) dan `video` (link YouTube diubah ke embed; link mp4/webm langsung diputar dengan `<video>`).
- Konten bertanda `isStudentProject` menampilkan badge **Hasil Praktek Siswa**.
- Bookmark disimpan per pengguna lewat `/api/bookmarks`.

## Testing

Jest + React Testing Library: test utility (format tanggal & durasi, helper video/cover), komponen (Navbar, ContentCard, BookmarkButton), dan halaman (login redirect aman, daftar konten, form admin).

```bash
npm test
```

## Struktur Proyek

```text
src/
├── admin/       Halaman admin: kelola konten & form konten
├── api/         Axios client dan session helper
├── components/  Navbar, ContentCard, BookmarkButton, route guards, state UI
├── context/     Auth context (login/register/logout/refresh)
├── pages/       Halaman siswa
├── styles/      Design token & responsive styles
└── utils/       Formatting, helper konten/video, analytics
```
