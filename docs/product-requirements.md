# Dokumen Persyaratan Produk (PRD)
### My Skill — Platform Pembelajaran Praktik untuk Siswa SMK Teknik

| | |
|---|---|
| **Mata Kuliah** | Pengembangan Platform Khusus |
| **Luaran** | Proyek Akhir — Aplikasi My Skill (web + mobile + API) |
| **Dokumen** | Persyaratan Produk (platform pembelajaran praktik) |
| **Dokumen Pendamping** | `technical-requirements.md` |
| **Status** | Draf untuk ditinjau |
| **Tanggal** | 2026-08-13 |

---

## 1. Overview & Vision

My Skill adalah platform belajar untuk siswa SMK bidang teknik. Isinya berupa informasi hasil praktik yang pernah mereka kerjakan di sekolah, plus konten bermanfaat lainnya untuk membuat barang atau memperbaiki kendaraan dan rumah. Kontennya bisa dibaca (artikel) atau ditonton (video).

Sesuai ketentuan tugas, semua konten hanya bisa diakses setelah user register dan login. User yang belum login hanya bisa melihat halaman login dan register.

Proyek ini terdiri dari satu web app (React), satu mobile app (React Native), dan satu API (Node.js/Express) dengan database MongoDB. Web dan mobile memakai API yang sama.

Empat halaman minimal yang diminta tugas (register, login, home, detail) terpenuhi. Kami tambahkan beberapa halaman lain: content list, bookmark, profile, dan content management untuk admin.

Catatan: semua fitur di dokumen ini masih dalam cakupan materi Modul Lab 1-5 (React, Node/Express, MongoDB, React Native/Expo, JWT, deployment). Kami sengaja tidak menambah fitur di luar itu supaya aplikasi bisa selesai, di-deploy, dan didemokan dari awal sampai akhir.

---

## 2. Goals & Success Criteria

| # | Tujuan | Sinyal keberhasilan |
|---|------|----------------|
| G1 | User baru bisa register, login, lalu mengakses konten | Guest → register → login → home → buka detail artikel/video |
| G2 | User bisa menemukan konten yang relevan | Search + filter kategori dan type (artikel/video) di content list |
| G3 | Akses konten dibatasi autentikasi di semua klien | API menolak request konten tanpa token valid (`401`); UI hanya redirect ke login |
| G4 | Satu backend melayani web dan mobile | Web dan mobile memakai API yang sama untuk seluruh alur (login, konten, bookmark) |
| G5 | Konten bisa dikelola dan aplikasi siap di-deploy | Admin bisa create/update/unpublish konten; local build dan deployment terdokumentasi |

---

## 3. Personas & Roles

| Persona | Deskripsi | Pekerjaan utama |
|---------|-------------|-------------------------|
| **Guest** | Belum register / belum login | Hanya bisa membuka halaman login dan register. Tidak bisa melihat konten sama sekali (BR-1) |
| **Student** | Akun standar setelah register | Mencari konten, membaca/menonton, menyimpan bookmark, mengelola profile |
| **Content Admin** | Akun ber-role admin | Membuat, mengubah, dan unpublish konten |

Semua akun yang register otomatis jadi student. Akun admin dibuat khusus lewat seed/console, bukan lewat halaman register publik. Student tidak bisa masuk ke halaman content management, sedangkan admin tetap bisa membaca konten seperti student biasa (BR-7).

---

## 4. Scope

### 4.1 In scope
- Auth wajib (register, login, JWT, protected area) di web dan mobile.
- Home: greeting user, kategori utama, konten unggulan.
- Content list: search (judul), filter kategori & type, pagination.
- Content detail: artikel lengkap atau video player, metadata, tombol bookmark.
- Bookmark: simpan / lihat / hapus konten favorit.
- Profile: lihat info akun, logout.
- Content management oleh admin (CRUD + publish) di web.
- Web responsif (React/Vite), mobile (React Native/Expo), API (Express + MongoDB).
- Public deployment dan basic monitoring.

### 4.2 Out of scope
- Upload gambar/video sendiri. Gambar sampul dan video dirujuk lewat URL.
- Pembayaran/subscription. Semua konten gratis untuk user terdaftar.
- Kuis, penilaian, sertifikat, forum/komentar, dan chat antar user.
- Peran guru/sekolah dan class management. Konten dikelola admin aplikasi.
- Push notification, offline download, multi-bahasa (konten dalam Bahasa Indonesia).
- Learning analytics per user (riwayat baca/tonton).

Fitur di luar daftar ini sengaja tidak dikerjakan di versi pertama; kalau nanti dibutuhkan, tinggal ditambahkan.

---

## 5. Product Requirements — Web & Mobile

Web (React + Vite) dan mobile (React Native + Expo) punya fitur yang sama dan memakai API yang sama.

### 5.1 Feature list

| ID | Fitur | Web | Mobile | Auth wajib |
|----|---------|:---:|:------:|:-------------:|
| F1 | Register | ✅ | ✅ | — |
| F2 | Login | ✅ | ✅ | — |
| F3 | Home (greeting + kategori + konten unggulan) | ✅ | ✅ | **Ya** |
| F4 | Content list dengan search & filter | ✅ | ✅ | **Ya** |
| F5 | Content detail (artikel / video) | ✅ | ✅ | **Ya** |
| F6 | Bookmark (simpan / lihat / hapus) | ✅ | ✅ | **Ya** |
| F7 | Profile (info akun, logout) | ✅ | ✅ | Ya |
| F8 | Content management — CRUD + publish | ✅ | opsional | Ya (admin) |

### 5.2 User stories & acceptance criteria

**F1/F2 — Register & login** *(pintu masuk wajib)*
> Sebagai calon user, saya ingin register dan login supaya bisa membuka konten belajar.
- **AC1:** Register butuh `name`, `email`, dan `password` minimal 8 karakter. Email yang sudah terdaftar ditolak.
- **AC2:** Login yang berhasil mengembalikan **JWT**. Tanpa token itu, halaman konten tidak bisa dibuka.
- **AC3:** Di mobile, token disimpan di perangkat (SecureStore/AsyncStorage) dan sesi tetap ada walau aplikasi ditutup lalu dibuka lagi.

**F3 — Home**
> Sebagai student, saya ingin langsung melihat ringkasan konten setelah login.
- **AC1:** Home menampilkan greeting, kategori utama, dan konten unggulan (terbaru/terpilih).
- **AC2:** Kalau belum login, user diarahkan ke halaman login; setelah login, kembali ke halaman yang tadi dibuka.
- **AC3:** Klik kategori langsung membuka content list yang sudah difilter.

**F4 — Content list**
> Sebagai student, saya ingin search dan filter konten supaya cepat menemukan topik yang dicari.
- **AC1:** Kartu konten menampilkan cover image, judul, kategori, type (artikel/video), dan durasi baca/tonton.
- **AC2:** Search memfilter judul (case-insensitive, substring match).
- **AC3:** Filter kategori dan type mempersempit daftar; daftar pakai pagination supaya tidak berat.
- **AC4:** Konten bertanda `isStudentProject` menampilkan badge "Hasil Praktek Siswa".
- **AC5:** Layout menyesuaikan layar: satu kolom di HP, grid di layar lebar.

**F5 — Content detail**
> Sebagai student, saya ingin membaca artikel atau menonton video lengkap beserta informasinya.
- **AC1:** Artikel menampilkan isi lengkap; video menampilkan video player (URL video).
- **AC2:** Metadata tampil: kategori, type, durasi, tanggal publish, dan asal konten (tim atau hasil praktik siswa).
- **AC3:** Ada tombol bookmark dan statusnya mencerminkan kondisi sekarang (sudah/belum tersimpan).
- **AC4:** Konten yang di-unpublish tidak pernah muncul dari API (`404`, bukan bocor).

**F6 — Bookmark**
> Sebagai student, saya ingin menyimpan konten supaya mudah dibuka lagi.
- **AC1:** Bookmark hanya bisa dilihat/dihapus oleh pemiliknya. Ini dipaksa di API, bukan hanya di UI (BR-4).
- **AC2:** Menyimpan konten yang sudah tersimpan tidak membuat duplikat (toggle).
- **AC3:** Halaman bookmark menampilkan konten yang disimpan, terbaru dulu, dan bisa dibuka detailnya.

**F8 — Content management (admin)**
> Sebagai admin, saya ingin menambah dan memperbarui konten supaya student selalu punya materi baru.
- **AC1:** Konten baru butuh judul, ringkasan, kategori, dan type. Artikel wajib punya `body`, video wajib punya `videoUrl` (BR-5).
- **AC2:** Konten baru yang di-publish langsung muncul di content list student (F4).
- **AC3:** Hanya admin yang bisa create/update/unpublish konten. Akun student ditolak (`401`/`403` — BR-7).
- **AC4:** Unpublish konten menyembunyikannya dari student tanpa menghapus datanya (BR-6).

---

## 6. Business Rules

| ID | Aturan |
|----|------|
| **BR-1** | **Gated content:** membaca content list, content detail, dan bookmark memerlukan token **user terdaftar** yang valid. Pembatasan diterapkan di layer API (`401` jika token tidak ada/tidak valid); redirect UI ke login hanya kemudahan, bukan satu-satunya penghalang. |
| **BR-2** | **Unique account:** email unik; register dengan email yang sudah terdaftar ditolak. |
| **BR-3** | **Credential security:** password disimpan sebagai hash (bcrypt); tidak pernah disimpan atau dicatat dalam plain text. |
| **BR-4** | **Bookmark ownership:** user hanya bisa melihat, menambah, dan menghapus bookmark **miliknya sendiri**. |
| **BR-5** | **Content type consistency:** konten ber-type `artikel` wajib punya `body`; konten ber-type `video` wajib punya `videoUrl`. |
| **BR-6** | **Publishing:** konten dengan `isPublished: false` tidak pernah dikembalikan oleh content endpoints (list maupun detail). Unpublish bersifat soft delete — data tetap ada untuk admin. |
| **BR-7** | **Admin authorization:** hanya akun ber-role `admin` yang bisa create, update, atau unpublish konten. Token student ditolak dengan `403`. |

---

## 7. Non-Functional Requirements

| Kategori | Persyaratan |
|----------|-------------|
| **Responsiveness** | Layout web pakai Flexbox/CSS Grid dan menyesuaikan dari layar HP (~360px) sampai desktop (~1280px+). |
| **Usability** | Navigasi konsisten; ada loading / empty / error state yang jelas; aksi utama bisa dijangkau dalam ≤ 3 ketukan; artikel nyaman dibaca (tipografi dan spasi longgar). |
| **Performance** | Content list terbuka dalam beberapa detik di koneksi normal; pakai pagination supaya payload tidak membengkak. |
| **Security** | Password di-hash; secrets disimpan di environment variable; protected routes dicek di server; input divalidasi (lihat TRD §9). |
| **Availability** | Alur web/API lokal bisa dijalankan mengikuti dokumentasi; public deployment (web, API, mobile) terdokumentasi. |
| **Maintainability** | Satu API dipakai web dan mobile; REST contract stabil untuk kedua klien. |
| **Observability** | Basic monitoring/analytics dipasang di web client (Google Analytics atau LogRocket). |

---

## 8. Assumptions & Constraints

- Seluruh konten dan antarmuka dalam Bahasa Indonesia; aplikasi gratis tanpa subscription.
- Cover image dan video dirujuk lewat URL HTTP(S); tidak ada upload service.
- Kategori konten berupa fixed enum di versi ini (Otomotif, Elektronika, Kelistrikan, Bangunan, Pemesinan & Pengelasan).
- Konten diisi manual oleh admin lewat form; belum ada mass import.
- Semua user terdaftar bisa mengakses semua konten; tidak ada konten berbayar atau pembatasan per jurusan.
- Tech stack sudah ditentukan tugas (lihat `technical-requirements.md` §3): React JS, React Native, Node.js/Express, MongoDB.

---

## 9. Rubric Mapping (Soal 1–5)

| Soal (bobot) | Topik | Dicakup oleh |
|---------------|-------|-----------|
| **Soal 1 (20%)** | Frontend Web React | F1–F5 di web (register, login, home, list, detail) + React Router + Flexbox/Grid responsif |
| **Soal 2 (20%)** | Backend Node/Express + MongoDB | API bersama: pengelolaan user & konten, CRUD + validasi (lihat TRD §6) |
| **Soal 3 (20%)** | Mobile React Native | F1–F5 di mobile (login, register, home, content list, detail) memakai API yang sama |
| **Soal 4 (20%)** | Integrasi Data & Autentikasi | JWT auth F1/F2, protected routes & gated content BR-1/BR-7, integrasi API Axios/Fetch |
| **Soal 5 (15%)** | Deployment & Pemantauan | Web analytics diimplementasikan; public deployment web/API/mobile terdokumentasi |

---

## Appendix A — Glossary

- **Gated content** — semua konten hanya bisa diakses user yang sudah login, dan dipaksa di API.
- **Bookmark** — fitur menyimpan konten favorit milik user.
- **Hasil Praktek Siswa** — konten yang menampilkan hasil praktik siswa SMK (`isStudentProject`), diberi badge khusus.
- **Home** — halaman utama aplikasi setelah login.
- **Soft delete** — unpublish konten tanpa menghapus datanya (`isPublished: false`).
