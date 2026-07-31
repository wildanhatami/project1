import { requireAdmin } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="w-full min-h-screen bg-brand-light-cream/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta mb-1">
            Panel Admin
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-brown">
            Dashboard It&apos;s Tasty
          </h1>
          <p className="text-brand-gray text-sm mt-1">
            Halo, {session.user?.name ?? "Admin"} — kelola katalog produk di sini.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <AdminSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
