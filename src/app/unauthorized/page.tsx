import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-brand-brown/8 px-8 py-12 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-brown mb-3">
          Akses Ditolak
        </h1>
        <p className="text-brand-gray mb-8 leading-relaxed">
          Halaman ini khusus untuk Admin It&apos;s Tasty. Jika Anda adalah admin,
          hubungi pemilik toko untuk mendapatkan akses.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-3 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
