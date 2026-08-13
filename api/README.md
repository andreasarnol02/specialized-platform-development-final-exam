# My Skill API

API Node.js/Express + MongoDB untuk platform pembelajaran praktik **My Skill** — konten teknik untuk siswa SMK. Dibuat dengan auth JWT, gated content (semua endpoint konten butuh token), role `siswa`/`admin`, dan sistem bookmark.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB (lokal atau Atlas)

## Setup Lokal

```bash
npm install
cp .env.example .env   # lalu isi MONGODB_URI & JWT_SECRET
npm run dev            # API di http://localhost:4000
```

Generate secret JWT:

```bash
openssl rand -hex 32
```

## Environment

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `PORT` | `4000` | Port API |
| `MONGODB_URI` | kosong | Connection string MongoDB |
| `JWT_SECRET` | kosong | Secret signing JWT — acak & panjang, jangan commit |
| `JWT_EXPIRES` | `7d` | Masa berlaku token JWT |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Origin web yang diizinkan, pisah dengan koma |

## Endpoint API

Semua response JSON. Sukses `{ success, message, data }`, error `{ success:false, message, data:null }`. Error validasi tambah `details: [{ field, message }]`.

### Auth (`/api/auth`)

| Method | Path | Auth | Keterangan |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Daftar siswa baru `{ name, email, password }`, return `{ token, user }` |
| `POST` | `/api/auth/login` | — | Login `{ email, password }` -> `{ token, user }` |
| `GET` | `/api/auth/me` | Bearer | Profil user yang login |

### Contents (`/api/contents`) — **gated, butuh JWT**

| Method | Path | Auth | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/api/contents?search=&category=&type=&page=` | Bearer | Daftar konten `isPublished:true`, urut terbaru, limit 12. Data: `{ contents, page, pages, total }` |
| `GET` | `/api/contents/:id` | Bearer | Detail konten; 404 jika tidak ada / tidak dipublikasi |
| `POST` | `/api/contents` | Bearer + **admin** | Buat konten, `createdBy` = user login |
| `PUT` | `/api/contents/:id` | Bearer + **admin** | Update konten |
| `DELETE` | `/api/contents/:id` | Bearer + **admin** | Soft delete: set `isPublished:false` |

**Kategori konten:** `Otomotif`, `Elektronika`, `Kelistrikan`, `Bangunan`, `Pemesinan & Pengelasan`
**Tipe konten:** `artikel` (wajib `body`) atau `video` (wajib `videoUrl`)

### Bookmarks (`/api/bookmarks`) — butuh JWT, scoped ke user login

| Method | Path | Auth | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/api/bookmarks` | Bearer | Daftar bookmark user, content di-populate, urut terbaru |
| `POST` | `/api/bookmarks/:contentId` | Bearer | Toggle create — idempotent, tidak duplikat (indeks unik). 404 jika konten tidak ada / tidak dipublikasi |
| `DELETE` | `/api/bookmarks/:contentId` | Bearer | Hapus bookmark milik user; 404 jika tidak ada |

### Root

| Method | Path | Auth | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/` | — | `{ success:true, message:"My Skill API is running", data:{ status:"ok" } }` |

## Scripts

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan API dengan Nodemon |
| `npm start` | Jalankan API mode produksi |
| `npm test` | Jest + supertest (`--runInBand`) |
| `npm run seed` | Seed admin + 10 konten sample |

## Seeding

```bash
MONGODB_URI=<connection-string> JWT_SECRET=<secret> npm run seed
```

Membuat:
- **Admin:** `admin@myskill.test` / `admin1234`
- **10 konten sample** lintas 5 kategori, campuran artikel & video, ≥2 dengan `isStudentProject:true`.

## Keamanan & Kepemilikan

- Semua endpoint konten butuh JWT valid (401 tanpa token).
- Tulis konten (POST/PUT/DELETE) hanya role `admin` (403 untuk siswa).
- Bookmark di-scope ke user login; user B tidak dapat menghapus bookmark user A (404).
- Password di-hash bcrypt 10 rounds, JWT payload `{ sub, role }`.
- Rate limit 20 request / 15 menit untuk rute auth.
- Bookmark punya indeks unik `{ user, content }` sehingga duplikat tidak mungkin.

## Pengujian

Test pakai Jest + supertest, mock model Mongoose (tidak butuh koneksi DB).

```bash
npm test
```

Test suite:
1. `app.integration.test.js` — health, 404, 500 safe, 401 gated content tanpa token, role validation
2. `contentController.test.js` — update & soft delete, 404 ketika hilang
3. `bookmarkController.test.js` — toggle, idempotent, ownership enforcement
4. `validation.integration.test.js` — artikel tanpa body 400, video tanpa videoUrl 400, kategori/tipe invalid 400, register/login validation