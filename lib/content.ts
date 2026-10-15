/* =====================================================================
   SEMUA TEKS DI FILE INI ADALAH CONTOH.
   Ganti dengan fakta barbershop yang sebenarnya sebelum dipublikasikan.
   ===================================================================== */

/* ---------- LAYANAN ---------- */
// Urutan kategori di halaman Layanan (nama harus sama dengan kolom category di database)
export const CATEGORY_ORDER = [
  "Potong Rambut",
  "Cukur & Jenggot",
  "Perawatan Rambut",
  "Pewarnaan",
  "Paket Hemat",
];

export const CATEGORY_INFO: Record<string, string> = {
  "Potong Rambut":
    "Dari potongan harian yang rapi sampai model gradasi, dikerjakan sesuai bentuk wajah dan karakter rambutmu.",
  "Cukur & Jenggot":
    "Merapikan, membentuk, dan membersihkan area jenggot, kumis, dan garis leher.",
  "Perawatan Rambut":
    "Perawatan untuk kulit kepala dan rambut supaya lebih bersih, segar, dan nyaman.",
  Pewarnaan:
    "Menutup uban atau mengganti warna rambut, dengan konsultasi warna terlebih dulu.",
  "Paket Hemat":
    "Gabungan layanan favorit dengan harga lebih hemat dan cukup satu kali antre.",
};

export const SERVICE_NOTES = [
  "Harga dapat berbeda untuk rambut sangat panjang atau model yang butuh pengerjaan ekstra.",
  "Durasi adalah perkiraan dan dipakai untuk menghitung estimasi antrean.",
  "Untuk pewarnaan, konsultasikan warna dan kondisi rambut dengan barber sebelum mulai.",
  "Ada pertanyaan soal layanan? Hubungi kami lewat WhatsApp di halaman Kontak.",
];

/* ---------- TENTANG ---------- */
export const ABOUT = {
  headline: "Tempat cukur langganan warga, dengan antrean yang lebih tertib.",
  since: "", // contoh: "2019". Kosongkan kalau tidak ingin ditampilkan
  story: [
    "Kami berangkat dari keyakinan sederhana: potongan rambut yang rapi tidak harus mahal, dan pelanggan tidak seharusnya menghabiskan waktu berjam-jam menunggu giliran.",
    "Karena itu kami menghadirkan sistem antrean online. Kamu bisa mengambil nomor dari rumah, memantau giliran dari HP, lalu datang tepat sebelum dipanggil. Di hari biasa, akhir pekan, maupun menjelang hari raya, antrean jadi lebih jelas untuk semua orang.",
    "Setiap pelanggan dilayani dengan teliti, mulai dari konsultasi model sampai sentuhan akhir. Kami ingin kamu pulang dengan tampilan rapi dan rasa puas, bukan sekadar rambut yang pendek.",
  ],
  values: [
    {
      title: "Rapi dan teliti",
      text: "Setiap potongan dikerjakan detail, dari garis rambut sampai sisi belakang kepala.",
    },
    {
      title: "Bersih dan nyaman",
      text: "Peralatan dijaga kebersihannya dan tempat dibuat nyaman untuk semua usia.",
    },
    {
      title: "Hargai waktumu",
      text: "Antrean online dan estimasi jam supaya waktumu tidak habis menunggu.",
    },
    {
      title: "Ramah seperti tetangga",
      text: "Kami melayani dengan santai dan terbuka. Bebas berdiskusi soal model yang kamu mau.",
    },
  ],
};

// Foto galeri, taruh file di public/images/gallery/. Kosong = bagian galeri disembunyikan
export const GALLERY: string[] = [
  // "/images/gallery/1.jpg",
  // "/images/gallery/2.jpg",
];

/* ---------- KONTAK ---------- */
export const HOURS = [
  { day: "Senin", time: "09:00 - 21:00" },
  { day: "Selasa", time: "09:00 - 21:00" },
  { day: "Rabu", time: "09:00 - 21:00" },
  { day: "Kamis", time: "09:00 - 21:00" },
  { day: "Jumat", time: "09:00 - 21:00" },
  { day: "Sabtu", time: "09:00 - 21:00" },
  { day: "Minggu", time: "09:00 - 21:00" },
];

export const HOURS_NOTE =
  "Jam buka bisa berubah menjelang dan saat hari raya. Cek WhatsApp untuk kepastian.";

export const DIRECTIONS =
  "Patokan lokasi: tulis di sini patokan yang mudah dikenali, misalnya dekat balai desa atau pertigaan tertentu, dan keterangan parkir.";

export const CONTACT_FAQ = [
  {
    q: "Metode pembayaran apa yang diterima?",
    a: "Tulis di sini metode pembayaran yang berlaku, misalnya tunai atau QRIS.",
  },
  {
    q: "Apakah menerima anak-anak?",
    a: "Tentu. Ada layanan potong rambut anak, dan orang tua boleh menemani di dalam.",
  },
  {
    q: "Bagaimana kalau saya terlambat?",
    a: "Kabari lewat WhatsApp. Nomor yang dipanggil tetapi belum hadir dapat dilewati barber supaya antrean tidak tertahan.",
  },
  {
    q: "Bisa membatalkan antrean?",
    a: "Bisa. Kirim pesan WhatsApp berisi nama dan nomor antreanmu, nanti barber membatalkannya.",
  },
];