"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageSquare, MapPin, LogOut, LayoutDashboard, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const InstagramIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.36a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.62a6.34 6.34 0 0 0 6.34 6.34V9.07a8.16 8.16 0 0 0 4.91 1.62V7.24a4.85 4.85 0 0 1-1-.55z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "admin";
  const { getTotalItems, openCart } = useCart();

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu if window is resized to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Katalog", href: "/katalog" },
    { name: "Testimoni", href: "/testimoni" },
    { name: "Tentang Kami", href: "/tentang-kami" },
  ];

  return (
    <>
      <nav className="w-full py-6 px-8 md:px-16 flex items-center justify-between sticky top-0 bg-brand-cream/90 backdrop-blur-md z-50">
        <Link 
          href="/" 
          onClick={closeMenu}
          className="font-signature text-3xl md:text-4xl text-brand-terracotta z-50"
        >
          It&apos;s Tasty
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                className={`relative py-1 text-sm font-medium transition-colors group ${
                  isActive ? "text-brand-terracotta font-semibold" : "text-brand-brown hover:text-brand-terracotta"
                }`}
              >
                <span>{link.name}</span>
                <span 
                  className={`absolute bottom-0 left-0 h-[2px] bg-brand-terracotta transition-all duration-300 rounded-full ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                />
              </Link>
            );
          })}
        </div>
        
        {/* Desktop Session / Auth */}
        <div className="hidden md:flex items-center gap-3 w-24 justify-end">
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 text-brand-brown hover:text-brand-terracotta transition-colors"
            title="Keranjang"
          >
            <ShoppingBag size={18} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-brand-terracotta text-white"
                      : "bg-brand-brown/5 text-brand-brown hover:bg-brand-brown/10"
                  }`}
                >
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-gray hover:text-brand-terracotta transition-colors"
                title={`Keluar (${session?.user?.name ?? ""})`}
              >
                <LogOut size={14} />
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-brown hover:text-brand-terracotta transition-colors"
            >
              <User size={14} />
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-brand-brown hover:text-brand-terracotta transition-colors z-50 focus:outline-none focus:ring-0 bg-transparent border-none p-2 -mr-2"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-cream/98 backdrop-blur-xl pt-28 pb-8 px-6 md:hidden flex flex-col justify-between items-center overflow-y-auto"
          >
            {/* Center Navigation Links & CTA */}
            <div className="w-full flex flex-col items-center space-y-6 my-auto">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`text-2xl font-serif font-medium transition-all duration-300 flex items-center gap-2 ${
                        isActive 
                          ? "text-brand-terracotta scale-105" 
                          : "text-brand-brown hover:text-brand-terracotta"
                      }`}
                    >
                      {isActive && <span className="w-2 h-2 rounded-full bg-brand-terracotta" />}
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

               {/* Cart Button */}
               <motion.div
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ delay: links.length * 0.05 + 0.05, duration: 0.3, ease: "easeOut" }}
                 className="pt-2 w-full max-w-xs"
               >
                 <button
                   onClick={() => { closeMenu(); openCart(); }}
                   className="w-full flex items-center justify-center gap-2 bg-brand-light-cream border border-brand-brown/15 text-brand-brown font-medium py-3 px-6 rounded-full transition-all shadow-sm active:scale-95 text-sm"
                 >
                   <ShoppingBag size={16} />
                   <span>Keranjang ({getTotalItems()})</span>
                 </button>
               </motion.div>

               {/* WhatsApp Quick Action Button */}
               <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: links.length * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
                className="pt-4 w-full max-w-xs flex flex-col gap-2"
              >
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center justify-center gap-2 text-sm text-brand-gray mb-1">
                      <span className="w-8 h-8 rounded-full bg-brand-terracotta/15 flex items-center justify-center">
                        <User size={15} className="text-brand-terracotta" />
                      </span>
                      <span className="font-medium text-brand-brown truncate max-w-[200px]">
                        {session?.user?.name}
                      </span>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={closeMenu}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-brand-brown/15 text-brand-brown font-medium py-3 px-6 rounded-full transition-all shadow-sm active:scale-95 text-sm"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center justify-center gap-2 bg-white border border-brand-brown/15 text-brand-gray font-medium py-3 px-6 rounded-full transition-all shadow-sm active:scale-95 text-sm"
                    >
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-brand-brown/15 text-brand-brown font-medium py-3 px-6 rounded-full transition-all shadow-sm active:scale-95 text-sm"
                  >
                    <User size={16} />
                    <span>Masuk</span>
                  </Link>
                )}
                <a
                  href="https://wa.me/6285718314942?text=Halo%20Admin%20It's%20Tasty,%20saya%20mau%20konsultasi%20pesanan%20kue"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-3 px-6 rounded-full transition-all shadow-md active:scale-95 text-sm"
                >
                  <MessageSquare size={16} />
                  <span>Pesan via WhatsApp</span>
                </a>
              </motion.div>
            </div>

            {/* Bottom Info & Social Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="w-full flex flex-col items-center gap-3 pt-6 border-t border-brand-brown/10 mt-auto"
            >
              <span className="text-[10px] font-semibold text-brand-gray/60 uppercase tracking-widest">
                Hubungi & Kunjungi
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <a
                  href="https://maps.app.goo.gl/bXF7b72Saev6xNsz9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white border border-brand-brown/10 text-brand-brown px-3 py-1.5 rounded-full text-[11px] font-medium transition-transform active:scale-95 shadow-xs"
                >
                  <MapPin size={13} className="text-brand-terracotta" />
                  <span>Sepatan, Tangerang</span>
                </a>

                <a
                  href="https://www.instagram.com/itstasty.id?igsh=aXdiYnRld2owZXhz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white border border-brand-brown/10 text-brand-brown px-3 py-1.5 rounded-full text-[11px] font-medium transition-transform active:scale-95 shadow-xs"
                >
                  <InstagramIcon size={13} className="text-brand-terracotta" />
                  <span>@itstasty.id</span>
                </a>

                <a
                  href="https://www.tiktok.com/@itstasty.id?_r=1&_t=ZS-98MDZGhuS1t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white border border-brand-brown/10 text-brand-brown px-3 py-1.5 rounded-full text-[11px] font-medium transition-transform active:scale-95 shadow-xs"
                >
                  <TikTokIcon size={13} className="text-brand-terracotta" />
                  <span>@itstasty.id</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
