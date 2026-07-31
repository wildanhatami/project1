import Link from "next/link";
import { Package, Eye, EyeOff, Users, ArrowRight } from "lucide-react";
import { getAllProducts } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await getAllProducts();
  const activeCount = products.filter((p) => p.isActive).length;

  const stats = [
    {
      label: "Total Produk",
      value: products.length,
      icon: Package,
      color: "bg-brand-terracotta/10 text-brand-terracotta",
    },
    {
      label: "Produk Aktif",
      value: activeCount,
      icon: Eye,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Produk Tersembunyi",
      value: products.length - activeCount,
      icon: EyeOff,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Pengguna Terdaftar",
      value: "-",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-brand-brown/8 p-4 md:p-5 flex flex-col gap-2.5 md:gap-3"
            >
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-serif font-bold text-brand-brown">
                  {stat.value}
                </p>
                <p className="text-[11px] md:text-xs text-brand-gray mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-brand-brown/8 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-brown">
              Produk Terbaru
            </h2>
            <p className="text-xs text-brand-gray mt-0.5">
              Produk yang sedang ada di katalog Notion.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-terracotta hover:text-brand-terracotta-hover transition-colors"
          >
            Kelola Produk
            <ArrowRight size={15} />
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-brand-gray text-sm py-6 text-center">
            Belum ada produk. Tambahkan halaman baru di database Notion Anda.
          </p>
        ) : (
          <div className="divide-y divide-brand-brown/8">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4 py-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-brand-brown/5"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-brown/5 flex items-center justify-center text-brand-gray text-xs">
                    No Img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-brown truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-brand-gray truncate">
                    {product.sizes
                      .map((s) => `${s.size} · Rp ${s.price.toLocaleString("id-ID")}`)
                      .join("  |  ") || "-"}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                    product.isActive
                      ? "bg-green-50 text-green-600"
                      : "bg-brand-brown/5 text-brand-gray"
                  }`}
                >
                  {product.isActive ? "Aktif" : "Tersembunyi"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
