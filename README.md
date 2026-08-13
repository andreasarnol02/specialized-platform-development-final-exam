# My Skill

Platform pembelajaran praktik untuk siswa SMK bidang teknik. Wadah informasi hasil praktik siswa di sekolah, plus konten berguna untuk membuat barang atau memperbaiki kendaraan dan rumah — bisa dibaca (artikel) atau ditonton (video). Semua konten hanya bisa diakses setelah register dan login.

Proyek ini terdiri dari web client React/Vite, aplikasi mobile React Native/Expo, API Node.js/Express, dan database MongoDB.

## Persyaratan

- Node.js 22.22.0 atau lebih baru
- MongoDB (Atlas atau lokal)
- npm

## Quick Start

Instal dependency di root workspace dan semua aplikasi:

```bash
npm install
npm --prefix api install
npm --prefix web install
npm --prefix mobile install
```

Buat file environment lokal:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

Isi `MONGODB_URI` dan `JWT_SECRET` (acak & panjang) di `api/.env`. Generate secret dengan:

```bash
openssl rand -hex 32
```

Seed data awal (akun admin + 10 konten contoh):

```bash
npm run seed
# Akun admin: admin@myskill.test / admin1234  (ganti password setelah login!)
```

Jalankan API dan web client sekaligus dari root repo:

```bash
npm run dev
```

Layanan bisa diakses di:

- Web client: `http://localhost:5173`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/`

Aplikasi mobile dijalankan terpisah via `npm run mobile` (Expo) dan membutuhkan API aktif di port `4000`.

## Perintah

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan API dan web client sekaligus |
| `npm run mobile` | Jalankan aplikasi mobile (Expo) |
| `npm run seed` | Seed akun admin + konten contoh |
| `npm test` | Jalankan test Jest untuk API dan web |
| `npm run build` | Build web untuk produksi |
| `npm --prefix api test` | Jalankan test API saja |
| `npm --prefix web test` | Jalankan test web saja |
| `npm --prefix web run test:e2e` | Playwright UI test (API dimock, tanpa server) |
| `npm --prefix web run test:e2e:live` | Playwright E2E penuh (butuh API + MongoDB aktif) |
| `npm --prefix web run preview` | Preview build produksi web |

## Area Aplikasi

Rute pelajar (semua konten wajib login):

- `/login` dan `/register` - masuk / daftar
- `/` - beranda (greeting, kategori, konten terbaru)
- `/konten` - daftar konten dengan search & filter (kategori, artikel/video)
- `/konten/:id` - detail konten (artikel lengkap / video player)
- `/bookmark` - konten tersimpan
- `/profile` - info akun dan logout

Rute admin (hanya akun ber-role `admin`):

- `/admin/konten` - kelola konten (list, publish/unpublish)
- `/admin/konten/baru` - buat konten baru
- `/admin/konten/:id/edit` - edit konten

Semua endpoint konten dan bookmark di API wajib membawa token JWT valid — pembatasan diterapkan di server (`401`), bukan hanya di UI.

## Struktur Proyek

```text
api/                 Express API, models, routes, middleware, dan tests
web/                 Aplikasi React/Vite (pelajar + admin)
mobile/              Aplikasi React Native/Expo (pelajar)
docs/                PRD, TRD, dan desain
.github/workflows/   CI checks
package.json         Root commands untuk dev, test, build, dan seed
```

Dokumentasi lengkap tersedia di:

- [`api/README.md`](api/README.md)
- [`web/README.md`](web/README.md)
- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/technical-requirements.md`](docs/technical-requirements.md)

## Verifikasi

CI workflow menjalankan test API, test + build frontend, bundle check mobile, dependency audit, analisis CodeQL, dan secret scan. Untuk verifikasi lokal, jalankan:

```bash
npm test
npm run build
```

Jangan commit file `.env` atau credential asli — hanya file `.env.example` yang boleh masuk version control.
