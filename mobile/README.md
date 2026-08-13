# My Skill Mobile (Expo)

Klien mobile **Expo (React Native)** untuk **My Skill** — platform pembelajaran praktik untuk siswa SMK Teknik. Aplikasi **khusus siswa** (student-only): Login, Register, Beranda, Daftar Konten (search + filter), Detail Konten (artikel/video), Bookmark, dan Profil. Dibangun dengan plain JSX, tanpa TypeScript, dengan teks antarmuka berbahasa Indonesia.

Semua konten **wajib login** (gated di API): user yang belum login hanya melihat halaman login dan register.

## Prasyarat

- **Node.js 22.22+**
- **Expo Go** di perangkat fisik, atau simulator/emulator (iOS/Android)
- **API backend berjalan** — lihat README di `../api`, API di port 4000

## Setup

```bash
npm install
cp .env.example .env   # opsional — hanya jika ingin override URL API
npx expo start
```

Buka aplikasi lewat Expo Go (scan QR code) atau tekan `i` / `a` untuk simulator.

### Catatan Expo Go

Expo Go hanya mendukung **satu versi SDK** pada satu waktu. Untuk SDK 57, gunakan versi Expo Go yang sesuai dengan SDK 57 (versi terbaru dari app store), atau jalankan di iOS simulator / Android emulator / development build.

## Catatan URL API

- **Default (development via Expo):** URL API dideteksi otomatis dari `hostUri` mesin dev dengan port **4000**, mis. `http://192.168.x.x:4000/api`.
- **Override:** setel `EXPO_PUBLIC_API_URL` di file `.env` (lihat `.env.example`).
- **Perangkat fisik:** pastikan perangkat dan mesin dev berada di jaringan yang sama, lalu setel `EXPO_PUBLIC_API_URL` ke IP LAN mesin dev, mis. `http://192.168.1.10:4000/api`.

## Struktur Proyek

```
mobile/
├── App.js                     # Provider + NavigationContainer + RootNavigator
├── app.json                   # Konfigurasi Expo (name "My Skill", slug "my-skill", plugins)
├── index.js                   # Entry Expo (registerRootComponent)
└── src/
    ├── theme/                 # Design tokens (warna hijau, spacing, radius, tipografi)
    ├── components/            # UI bersama: Icon, AppButton, BrandMark, ContentCard,
    │                          #   ContentImage, TypeBadge, CategoryRow, Toast, Screen, dll.
    ├── api/                   # apiClient (Bearer token) / getErrorMessage
    ├── context/               # AuthContext (login/register/logout/restore session)
    ├── navigation/
    │   ├── RootNavigator.jsx  # Auth-gated: Login/Register stack vs Main
    │   └── MainNavigator.jsx  # Bottom tabs (Beranda, Konten, Bookmark) + stack
    │                          #   (ContentDetail, Profile)
    └── screens/               # Login, Register, Home, Contents, ContentDetail,
                               #   Bookmarks, Profile, NotFound, RequireLogin
```

Alur auth: saat aplikasi dibuka, session dipulihkan dari SecureStore. Tanpa token → stack Login/Register; dengan token → main app (tabs + stack). `401` dari API memicu logout otomatis.

## Pemetaan Fitur PRD

| Fitur | Layar |
|---|---|
| Register & Login | `RegisterScreen`, `LoginScreen` |
| Home (greeting, kategori, konten terbaru) | `HomeScreen` (tab Beranda) |
| Content list (search judul, filter kategori & type, pagination) | `ContentsScreen` (tab Konten) |
| Detail konten (artikel / video + bookmark toggle) | `ContentDetailScreen` |
| Bookmark (lihat & hapus) | `BookmarksScreen` (tab Bookmark) |
| Profil (info akun + logout) | `ProfileScreen` (dari header Beranda) |

## Tech Stack

- **Expo SDK 57** (React Native 0.86, React 19.2)
- **React Navigation 7** — native stack + bottom tabs
- **axios** — HTTP client ke API (interceptor Bearer token + auto-logout on 401)
- **expo-secure-store** — penyimpanan token aman (plugin sudah terdaftar di `app.json`)
- **lucide-react-native** — ikon

## Testing

```bash
npm test
```

Menjalankan unit test Jest untuk helper di `src/utils` (format & content). CI menjalankan test yang sama dengan `npm test -- --runInBand`.

## Verifikasi

```bash
npx expo export --platform ios
```

Perintah di atas membundel aplikasi secara headless (smoke check CI) — harus lolos tanpa error.

## Catatan

- Kategori konten (enum tetap): Otomotif, Elektronika, Kelistrikan, Bangunan, Pemesinan & Pengelasan. Tipe konten: `artikel` | `video`.
- Video ditampilkan sebagai panel "Tonton di browser" (membuka `videoUrl` lewat `Linking`) — tanpa dependency video tambahan.
- Konten dengan `isStudentProject` menampilkan badge "Hasil Praktek Siswa".
