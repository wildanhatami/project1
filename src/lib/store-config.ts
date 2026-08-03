/**
 * Konfigurasi toko It's Tasty.
 * Ubah nilai-nilai di bawah ini sesuai kebutuhan tanpa mengubah kode lain.
 */

/** Nomor WhatsApp toko (format internasional, tanpa +) */
export const WA_NUMBER = "6285718314942";

/** Alamat toko (link Google Maps) */
export const STORE_ADDRESS = "Jl. Ahmad Yani Kp. Sarakan RT 002/003, Pisangan Jaya, Sepatan, Tangerang Regency, Banten 15520";
export const STORE_MAPS_URL = "https://maps.app.goo.gl/i5syToFi6SGK4HsH9?g_st=aw";

/** Jadwal operasional toko untuk opsi "Datang Langsung ke Toko" */
export const STORE_SCHEDULE = {
  days: ["Selasa", "Kamis", "Minggu"],
  openTime: "11:00 WIB",
  note: "Pre-Order (PO) dapat dilakukan kapan saja, setiap hari.",
} as const;

/**
 * Metode pembayaran.
 *
 * QRIS_IMAGE: letakkan gambar QRIS asli Anda di folder `public/`
 * (misalnya `public/QRIS.png`), lalu ganti path di bawah ini.
 */
export const PAYMENT_METHODS = {
  qris: {
    label: "QRIS",
    description: "Scan QRIS di bawah ini menggunakan aplikasi pembayaran apa pun (GoPay, OVO, DANA, ShopeePay, mobile banking, dll.)",
    imagePath: "/QRIS.png",
  },
  ewallet: {
    label: "E-Wallet",
    description: "Transfer ke salah satu e-wallet di bawah ini, lalu konfirmasi pembayaran.",
    accounts: [
      { name: "DANA", number: "085718314942", holder: "a.n. It's Tasty" },
      { name: "OVO", number: "085718314942", holder: "a.n. It's Tasty" },
      { name: "GoPay", number: "085718314942", holder: "a.n. It's Tasty" },
    ],
  },
  bank: {
    label: "Transfer Bank",
    description: "Transfer ke rekening di bawah ini, lalu konfirmasi pembayaran.",
    accounts: [
      { bank: "BCA", number: "1234567890", holder: "a.n. It's Tasty" },
      { bank: "Mandiri", number: "1234567890", holder: "a.n. It's Tasty" },
      { bank: "BRI", number: "1234567890", holder: "a.n. It's Tasty" },
    ],
  },
} as const;

/** Opsi metode pengambilan / pemesanan */
export const ORDER_METHODS = {
  preorder: {
    id: "preorder",
    label: "Pre-Order (PO)",
    description: "Pesanan dibuat setelah kamu memesan. Siap diambil sesuai kesepakatan.",
  },
  instore: {
    id: "instore",
    label: "Datang Langsung ke Toko",
    description: "Ambil langsung di toko saat stok tersedia.",
  },
} as const;
