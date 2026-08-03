import { requireAdmin } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="w-full min-h-screen bg-brand-cream flex flex-col font-sans">
      <AdminHeader />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-terracotta mb-1">
            Panel Admin
          </p>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand-brown">
            Dashboard It&apos;s Tasty
          </h1>
          <p className="text-brand-gray text-xs md:text-sm mt-0.5">
            Halo, {session.user?.name ?? "Admin"} — kelola toko dan pesanan di sini.
          </p>
        </div>

        <div className="w-full min-w-0">{children}</div>
      </main>
    </div>
  );
}
