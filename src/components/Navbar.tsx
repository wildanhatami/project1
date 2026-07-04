"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          It's Tasty
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="hover:text-brand-terracotta transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="w-24 hidden md:block">
          {/* Spacer to perfectly center links based on flex justify-between */}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-brown hover:text-brand-terracotta transition-colors z-50 focus:outline-none focus:ring-0 bg-transparent border-none p-2 -mr-2"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-cream pt-32 px-8 md:hidden flex flex-col items-center space-y-6"
          >
            {links.map((link, i) => (
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
                  className="text-2xl font-sans font-medium text-brand-brown hover:text-brand-terracotta transition-colors tracking-wide"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
