// Initial My Skill seed data: 1 admin account + 10 sample contents.
// Run with: npm run seed  (requires MONGODB_URI in .env)
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/user");
const Content = require("../src/models/content");

const CONTENTS = [
  {
    title: "Cara Ganti Oli Motor Sendiri",
    excerpt:
      "Panduan langkah demi langkah mengganti oli motor di rumah, lengkap dengan alat yang dibutuhkan.",
    category: "Automotive",
    type: "article",
    body: "Mengganti oli sendiri sebenarnya mudah dan menghemat biaya bengkel.\n\nAlat yang dibutuhkan: kunci ring 17 mm, kunci saringan oli, wadah penampung oli bekas, corong, dan lap.\n\nPertama, panaskan mesin sebentar agar oli lebih mudah mengalir. Matikan motor, ganjal agar stabil, lalu buka baut pembuangan oli di bagian bawah mesin. Tampung oli bekas di wadah — jangan dibuang sembarangan; serahkan ke bengkel atau tempat penampungan oli bekas.\n\nSetelah oli habis, pasang kembali baut pembuangan dengan kencang, buka saringan oli, ganti dengan yang baru, lalu isi oli baru sesuai kapasitas yang disarankan pabrikan. Terakhir, periksa level oli dengan dipstick dan nyalakan mesin sebentar untuk memastikan tidak ada kebocoran.",
    coverUrl: "https://picsum.photos/seed/ganti-oli/600/400",
    durationMinutes: 12,
    isStudentProject: false,
  },
  {
    title: "Membuat Lampu LED Sederhana untuk Menghias Kamar",
    excerpt:
      "Proyek elektronika dasar: merakit lampu LED dari komponen yang murah.",
    category: "Electronics",
    type: "article",
    body: "Proyek ini sangat cocok untuk pemula yang baru belajar elektronika.\n\nKomponen: LED 3V, resistor 100 ohm, baterai 9V, kabel jumper, dan breadboard.\n\nLetakkan LED di breadboard, hubungkan kaki anoda ke resistor, lalu sambungkan ke kutub positif baterai. Hubungkan kaki katoda ke kutub negatif. Jika LED tidak menyala, coba balik posisi kaki — LED hanya menyala satu arah.\n\nSetelah rangkaian berfungsi, kamu bisa merangkai beberapa LED secara paralel agar efeknya lebih hidup.",
    coverUrl: "https://picsum.photos/seed/lampu-led/600/400",
    durationMinutes: 20,
    isStudentProject: true,
  },
  {
    title: "Tips Memasang Keramik Dinding Kamar Mandi",
    excerpt: "Dasar-dasar memasang keramik dinding dengan rapi dan awet.",
    category: "Construction",
    type: "article",
    body: "Sebelum memasang keramik, pastikan dinding bersih, rata, dan sudah diplester.\n\nSiapkan perekat keramik (thin-bed), roskam bergerigi, palu karet, dan waterpass. Aduk perekat sesuai petunjuk kemasan hingga teksturnya seperti pasta.\n\nOleskan perekat ke dinding dengan roskam bergerigi, tekan keramik, lalu ketuk perlahan dengan palu karet agar posisinya rata. Gunakan waterpass di setiap baris dan pasang spacer agar jarak antar keramik tetap konsisten.\n\nTunggu perekat benar-benar kering sebelum melakukan nat. Hasil yang rapi bergantung pada baris pertama — pastikan baris pertama lurus sejak awal.",
    coverUrl: "https://picsum.photos/seed/keramik/600/400",
    durationMinutes: 25,
    isStudentProject: false,
  },
  {
    title: "Memperbaiki Stopkontak Mati di Rumah",
    excerpt:
      "Cara menelusuri dan memperbaiki stopkontak yang tidak berfungsi dengan aman.",
    category: "Electrical",
    type: "article",
    body: "PENTING: matikan saklar utama (MCB) sebelum menyentuh instalasi listrik.\n\nStopkontak mati biasanya disebabkan salah satu dari tiga hal: kabel longgar, MCB turun, atau stopkontak rusak.\n\nPertama, periksa MCB di panel — jika turun, kemungkinan ada beban lebih atau korsleting. Kedua, buka penutup stopkontak dan periksa sambungan kabel: kabel fasa (hitam/merah), kabel netral (biru), dan kabel ground (kuning-hijau) harus terpasang kuat pada terminal.\n\nJika semua sambungan baik tetapi stopkontak tetap mati, ganti dengan yang baru. Selalu gunakan tespen untuk memastikan tidak ada tegangan sebelum bekerja.",
    coverUrl: "https://picsum.photos/seed/instalasi/600/400",
    durationMinutes: 18,
    isStudentProject: false,
  },
  {
    title: "Dasar-Dasar Pengelasan SMAW untuk Pemula",
    excerpt:
      "Pengenalan las listrik: persiapan, posisi badan, dan kesalahan yang umum terjadi.",
    category: "Machining & Welding",
    type: "article",
    body: "SMAW (Shielded Metal Arc Welding) adalah teknik las listrik yang paling umum diajarkan di sekolah kejuruan.\n\nPersiapan: pastikan area kerja kering, kenakan helm las, sarung tangan kulit, dan baju lengan panjang. Bersihkan karat dan cat pada area yang akan dilas.\n\nAtur arus sesuai diameter elektroda (misalnya, elektroda 2,6 mm membutuhkan sekitar 70-90 ampere). Pegang elektroda dengan sudut sekitar 70 derajat, lalu goreskan ke benda kerja untuk memunculkan busur api.\n\nKesalahan umum pemula: menarik elektroda terlalu cepat sehingga lasan terputus-putus, atau terlalu lambat sehingga benda kerja tembus. Latihan konsisten pada besi bekas adalah kuncinya.",
    coverUrl: "https://picsum.photos/seed/pengelasan/600/400",
    durationMinutes: 30,
    isStudentProject: false,
  },
  {
    title: "Servis Rutin Motor: Cek Aki dan Busi",
    excerpt:
      "Praktik perawatan ringan yang bisa dilakukan siswa otomotif di sekolah.",
    category: "Automotive",
    type: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    coverUrl: "https://picsum.photos/seed/servis-aki/600/400",
    durationMinutes: 8,
    isStudentProject: false,
  },
  {
    title: "Membuat Power Bank Sederhana dari Sel 18650",
    excerpt:
      "Video proyek siswa: merakit power bank darurat dari baterai 18650.",
    category: "Electronics",
    type: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    coverUrl: "https://picsum.photos/seed/powerbank/600/400",
    durationMinutes: 10,
    isStudentProject: true,
  },
  {
    title: "Menyambung Kabel Listrik yang Putus dengan Benar",
    excerpt:
      "Teknik penyambungan kabel yang aman dan sesuai standar instalasi listrik.",
    category: "Electrical",
    type: "article",
    body: "Sambungan kabel yang asal-asalan adalah penyebab utama kebakaran listrik di rumah.\n\nStandar instalasi menekankan tiga hal: sambungan harus kuat secara mekanis, kontak listriknya baik, dan isolasinya rapi.\n\nKupas isolasi sekitar 2-3 cm, lilitkan kedua ujung kabel dengan kencang, lalu bungkus dengan isolasi listrik berkualitas. Untuk beban berat seperti AC atau kompor listrik, gunakan terminal atau konektor yang dijual di toko listrik.\n\nJangan pernah menyambung kabel di area lembap tanpa perlindungan tambahan seperti pipa fleksibel.",
    coverUrl: "https://picsum.photos/seed/sambung-kabel/600/400",
    durationMinutes: 15,
    isStudentProject: false,
  },
  {
    title: "Mengecat Pagar Rumah dengan Cara Mudah",
    excerpt: "Cara mengecat pagar besi tanpa belepotan dan hasilnya rata.",
    category: "Construction",
    type: "article",
    body: "Rahasia hasil cat pagar yang rapi ada di persiapan, bukan di goresan kuas.\n\nBersihkan karat dengan sikat kawat atau amplas kasar, lalu lap dengan kain lembap dan biarkan kering. Beri cat dasar agar cat penutup menempel dengan baik.\n\nGunakan kuas kecil untuk celah dan kuas sedang untuk permukaan yang lebar. Aplikasikan dua lapis tipis, tunggu lapisan pertama kering sebelum lapisan kedua. Tiga lapis tipis lebih baik daripada satu lapis tebal yang belepotan.\n\nTutupi area sekitar dengan koran atau plastik, dan pastikan tidak ada hujan saat mengecat.",
    coverUrl: "https://picsum.photos/seed/cat-pagar/600/400",
    durationMinutes: 22,
    isStudentProject: false,
  },
  {
    title: "Mengenal Jangka Sorong dan Cara Membacanya",
    excerpt:
      "Keterampilan mengukur presisi yang wajib dikuasai setiap siswa teknik pemesinan.",
    category: "Machining & Welding",
    type: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    coverUrl: "https://picsum.photos/seed/jangka-sorong/600/400",
    durationMinutes: 7,
    isStudentProject: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB terhubung, memulai seed...");

    const adminEmail = "admin@myskill.test";
    const existingAdmin = await User.findOne({ email: adminEmail });
    let admin;

    if (existingAdmin) {
      admin = existingAdmin;
      console.log("Admin sudah ada, dilewati.");
    } else {
      admin = await User.create({
        name: "My Skill Admin",
        email: adminEmail,
        password: await bcrypt.hash("admin1234", 10),
        role: "admin",
      });
      console.log("Akun admin dibuat:", adminEmail, "(password: admin1234)");
    }

    const count = await Content.countDocuments();
    if (count > 0) {
      console.log(`Sudah ada ${count} konten — seed konten dilewati.`);
    } else {
      await Content.insertMany(
        CONTENTS.map((c) => ({ ...c, createdBy: admin._id }))
      );
      console.log(`${CONTENTS.length} konten contoh dibuat.`);
    }

    console.log("Seed complete ✅");
  } catch (error) {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
