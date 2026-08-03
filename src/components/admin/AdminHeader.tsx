"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Produk", href: "/admin/products", icon: Package },
  { name: "Kelola Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { name: "Pengguna Terdaftar", href: "/admin/users", icon: Users },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-brown/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-signature text-2xl md:text-3xl text-brand-terracotta font-bold">
              It&apos;s Tasty
            </span>
          </Link>
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-brand-brown">
            <div className="w-8 h-8 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center font-bold text-sm shrink-0">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="font-semibold text-brand-brown truncate max-w-[140px]">
                {session?.user?.name ?? "Administrator"}
              </p>
              <p className="text-[10px] text-brand-gray capitalize">
                {session?.user?.role ?? "Admin"}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors shrink-0"
            title="Keluar dari Panel Admin"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="bg-brand-light-cream/70 border-t border-brand-brown/8 px-4 md:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-brand-terracotta text-white shadow-xs"
                    : "text-brand-brown hover:bg-brand-brown/5 border border-transparent"
                }`}
              >
                <Icon size={15} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
