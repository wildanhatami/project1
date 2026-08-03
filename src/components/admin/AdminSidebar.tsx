"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

const links = [
  { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Produk", href: "/admin/products", icon: Package },
  { name: "Kelola Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { name: "Pengguna Terdaftar", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
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
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-brand-terracotta text-white shadow-sm"
                  : "bg-white text-brand-brown hover:bg-brand-brown/5 border border-brand-brown/8"
              }`}
            >
              <Icon size={17} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
