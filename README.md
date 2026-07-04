# 🍰 It's Tasty - Boutique Bakery

Digital catalog and frontend for the It's Tasty boutique bakery. Built with Next.js App Router, Tailwind CSS, Framer Motion, and powered by Notion as a Headless CMS.

## 🚀 Cara Menjalankan Website Secara Lokal

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📝 Panduan Mengelola Katalog via Notion CMS

Katalog produk pada website ini sepenuhnya dikendalikan melalui Database di Notion. Anda tidak perlu mengubah kode apapun untuk menambah, menghapus, atau mengedit produk yang tampil.

### 1. Kolom / Properties Wajib di Notion
Untuk memastikan website tidak error dan desain tetap proporsional, pastikan Database Notion Anda memiliki kolom (*Properties*) berikut persis dengan nama dan tipe ini (Case-Sensitive):

| Nama Property di Notion | Tipe Property | Fungsi & Keterangan |
| :--- | :--- | :--- |
| **Name** | `Title` (Aa) | Nama produk (contoh: "Strawberry Shortcake Bento"). |
| **Description** | `Text` | Penjelasan singkat produk untuk ditampilkan di bawah judul. |
| **Image** | `Files & media` | Upload foto kue, atau *Embed* link gambar eksternal (rasio portrait direkomendasikan). |
| **Price_10cm** | `Number` | Harga untuk ukuran 10cm, ketik angka saja tanpa Rp/titik. |
| **Price_14cm** | `Number` | Harga untuk ukuran 14cm, ketik angka saja. |
| **IsActive** | `Checkbox` | **Wajib dicentang** jika produk ingin dimunculkan di website. |
| **IsBestseller** | `Checkbox` | Jika dicentang, produk akan mendapatkan tag eksklusif `"TERLARIS"`. |

### 2. Cara Update & Tambah Menu
1. Buka aplikasi Notion Anda dan masuk ke Database Katalog.
2. Untuk **menambah produk**, klik `+ New` lalu isi setiap kolom.
3. Untuk **menghapus sementara** produk yang sedang *Sold Out*, cukup **hapus centang** pada kolom `IsActive`.
4. Perubahan akan langsung terlihat di website dalam waktu paling lambat 60 detik.

---

## 🚀 Cara Deploy ke Vercel (Gratis & Otomatis)

Website ini dirancang khusus untuk berjalan sempurna di Vercel, yang secara otomatis menangani *server* dan koneksi ke Notion.

1. **Upload Kode ke GitHub:** Buat repository baru di GitHub dan *push* semua kode proyek ini.
2. **Import ke Vercel:** Login ke [Vercel](https://vercel.com/), buat *Project* baru, dan *import repository* GitHub tersebut.
3. **Konfigurasi Environment Variables:** Sebelum klik Deploy, buka menu *Environment Variables* di Vercel dan wajib masukkan 2 variabel berikut:
   - `NOTION_TOKEN` (Isi dengan Integration Token Notion Anda)
   - `NOTION_DATABASE_ID` (Isi dengan ID Database Katalog Notion Anda)
4. **Deploy:** Klik tombol Deploy dan tunggu 1-2 menit. Website Anda akan langsung online dan siap digunakan!

---
*Crafted with love for It's Tasty.*
