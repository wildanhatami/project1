# Panduan Setup Fitur Baru — It's Tasty

Dokumen ini menjelaskan langkah setup untuk fitur:
1. Autentikasi Google OAuth + RBAC (Pembeli/Admin)
2. Dashboard Admin & Manajemen Produk (via Notion)
3. Checkout dengan opsi Pre-Order / Datang Langsung + jadwal toko
4. Metode Pembayaran QRIS, E-Wallet, Transfer Bank

---

## 0. Dependensi

Semua package sudah ada di `package.json` (tidak perlu install tambahan):

- `next-auth@^5` — autentikasi Google OAuth
- `@notionhq/client@^5.22` — akses Notion API (termasuk file upload)
- `framer-motion`, `lucide-react` — UI (sudah ada)

```bash
npm install   # jika belum pernah dijalankan
```

## 1. Setup Notion Database (perubahan schema)

### Database Produk (NOTION_DATABASE_ID)

> Properti `Sizes` sudah ditambahkan otomatis via API ke database produk Anda.

Properti yang **sudah ada** dan tetap dipakai:

| Properti | Tipe | Keterangan |
|---|---|---|
| `Name` | Title | Nama produk |
| `Description` | Rich text | Deskripsi produk |
| `Image` | Files | Foto produk |
| `IsActive` | Checkbox | Tampil/tidak di katalog publik |
| `IsBestseller` | Checkbox | Badge "Terlaris" |
| `Price_10cm` | Number | (opsional, fallback) Harga ukuran 10cm |
| `Price_14cm` | Number | (opsional, fallback) Harga ukuran 14cm |

**Properti BARU yang perlu ditambahkan:**

| Properti | Tipe | Keterangan |
|---|---|---|
| `Sizes` | Rich text | JSON array varian ukuran & harga, contoh: `[{"size":"10cm","price":35000},{"size":"14cm","price":65000}]` |

> **Kenapa `Sizes` berupa JSON?** Notion API tidak bisa membuat properti Number baru secara dinamis. Dengan menyimpan array JSON di properti Rich text, admin bebas menambah/mengubah varian ukuran apa pun dari dashboard (mis. 8cm, 12cm, 16cm) tanpa mengedit schema Notion. Kolom `Price_10cm`/`Price_14cm` lama tetap dibaca sebagai fallback dan ikut disinkronkan otomatis saat admin menyimpan ukuran 10cm/14cm.

### Database Users (NOTION_USERS_DATABASE_ID)

> **Sudah dibuat otomatis via API** di halaman "It's Tasty" di Notion (nama: "It's Tasty - Users", ID sudah terisi di `.env.local`). Tidak perlu dibuat manual.

Struktur database yang dibuat:

| Properti | Tipe | Keterangan |
|---|---|---|
| `Name` | Title | Nama user |
| `Email` | Email | Email Google |
| `GoogleId` | Rich text | ID akun Google |
| `Role` | Select | Opsi: `customer`, `admin` (default `customer`) |
| `CreatedAt` | Date | Waktu pendaftaran |

ID database tersebut sudah terisi otomatis di `.env.local`.

**Memberi role Admin:** di Notion, ubah properti `Role` user menjadi `admin` pada baris user yang diinginkan.

## 2. Setup Google OAuth

1. Buka https://console.cloud.google.com → buat project → *APIs & Services → Credentials → Create Credentials → OAuth Client ID* (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dan domain produksi, mis. `https://project1-chi-two.vercel.app/api/auth/callback/google`).
3. Isi `.env.local`:

```env
GOOGLE_CLIENT_ID="..."          # ganti dari placeholder
GOOGLE_CLIENT_SECRET="..."      # ganti dari placeholder
AUTH_SECRET="..."               # sudah terisi, aman untuk diganti pakai `npx auth secret`
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Konfigurasi Toko & Pembayaran

Semua nilai ada di `src/lib/store-config.ts`:

| Item | Lokasi |
|---|---|
| Nomor WhatsApp | `WA_NUMBER` |
| Alamat & maps | `STORE_ADDRESS`, `STORE_MAPS_URL` |
| Jadwal operasional | `STORE_SCHEDULE` (default: Selasa, Kamis, Minggu; buka 11:00 WIB) |
| Gambar QRIS | `PAYMENT_METHODS.qris.imagePath` |
| Nomor E-Wallet (DANA/OVO/GoPay) | `PAYMENT_METHODS.ewallet.accounts` |
| Rekening bank (BCA/Mandiri/BRI) | `PAYMENT_METHODS.bank.accounts` |

**Mengganti gambar QRIS:** letakkan file gambar QRIS asli di folder `public/` (mis. `public/qris-itstasty.png`), lalu ubah:

```ts
imagePath: "/qris-itstasty.png",
```

> Saat ini menggunakan placeholder `public/qris-placeholder.svg` yang tampil di modal checkout dan modal QRIS.

## 4. Halaman & Fitur

### Autentikasi & RBAC
- Login Google: `/login`
- Proteksi route admin: `src/proxy.ts` (middleware) + `requireAdmin()` di layout — user non-admin dialihkan ke `/unauthorized`.
- Admin dapat login lalu mengakses `/admin` (tombol muncul di navbar).

### Dashboard Admin
- `/admin` — ringkasan produk.
- `/admin/products` — manajemen produk:
  - Tambah/hapus varian ukuran & harga
  - Unggah foto baru (upload langsung ke Notion, max 15MB, format JPG/PNG/WebP/GIF)
  - Ubah deskripsi
  - Tampilkan/sembunyikan dari katalog (IsActive)
  - Tandai bestseller
  - Hapus produk (mengarsipkan halaman di Notion)

API pendukung (semua dicek role admin):
- `GET /api/admin/products`
- `PATCH /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- `POST /api/admin/products/[id]/image` (multipart `file`)

### Checkout Pembeli
Dari kartu produk di `/katalog` (atau beranda), tombol **"Pesan Sekarang"** membuka modal checkout:
1. Wajib login Google (jika belum, tampil tombol login).
2. Pilih **Metode Pengambilan**: Pre-Order (PO) atau Datang Langsung ke Toko.
   - Saat memilih "Datang Langsung", ditampilkan jadwal operasional (Selasa/Kamis/Minggu, buka 11:00 WIB).
3. Pilih **Metode Pembayaran**:
   - **QRIS** — gambar QRIS (klik untuk tampil lebih besar)
   - **E-Wallet** — nomor DANA/OVO/GoPay (bisa disalin)
   - **Transfer Bank** — nomor rekening BCA/Mandiri/BRI (bisa disalin)
4. Klik **"Lanjutkan ke WhatsApp"** — ringkasan pesanan dikirim otomatis ke nomor admin.

## 5. Catatan Teknis

- Cache halaman katalog/beranda (ISR 60 detik) otomatis di-revalidate setelah perubahan produk dari admin.
- Foto yang diunggah via API ke Notion memiliki URL sementara (expire 1 jam); kode selalu membaca ulang URL saat render, jadi tidak masalah.
- Admin dashboard & API memakai `force-dynamic` agar data Notion selalu segar.

## 6. Verifikasi

```bash
npm run lint   # 0 error
npm run build  # harus sukses
```
