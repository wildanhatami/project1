"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 md:px-16 pt-8 md:pt-12 pb-16 md:pb-24 flex flex-col md:flex-row items-center gap-8 md:gap-20">
        <motion.div 
          className="flex-1 flex flex-col items-start gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 
            variants={fadeInUp}
            className="font-serif text-4xl md:text-7xl font-bold leading-[1.1] text-brand-brown"
          >
            Kebahagiaan <br /> dalam Sekotak <br /> Kue
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-brand-gray text-sm md:text-lg max-w-md"
          >
            Kue bento ala Korea dan burnt cheesecake premium, dibuat dengan bahan pilihan untuk setiap momen spesialmu.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link 
              href="/katalog" 
              className="inline-block bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              Lihat Menu
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex-1 w-full relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            {/* Using a placeholder since we don't have the actual assets exported */}
            <div className="w-full h-full bg-brand-brown/10 relative">
               <img 
                 src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop" 
                 alt="Hero Cake" 
                 className="object-cover w-full h-full"
               />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Gallery / Featured Section */}
      <section className="w-full max-w-7xl px-4 md:px-16 py-16 md:py-24 flex flex-col items-center border-t border-brand-brown/10">
        <motion.div 
          className="text-center mb-10 md:mb-16 flex flex-col items-center gap-2 md:gap-4 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="font-serif text-2xl md:text-4xl font-bold">Intip Karya Terbaru Kami</h2>
          <p className="text-brand-gray text-xs md:text-base">Kurasi rasa dan estetika dari oven kami.</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-12 w-full">
          {/* Left Column */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-12 mt-6 md:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4">
              <div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-[4/3] bg-brand-brown/5">
                <img 
                  src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop" 
                  alt="Classic Burnt Cheesecake" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">Classic Burnt Cheesecake</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">Krim keju premium dengan karamelisasi sempurna.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4">
              <div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-square bg-brand-brown/5">
                <img 
                  src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop" 
                  alt="Dark Cocoa Layers" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">Dark Cocoa Layers</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">Cokelat pekat untuk pecinta rasa mendalam.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="flex flex-col gap-6 md:gap-12 md:mt-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4 relative">
              <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-light-cream text-brand-terracotta text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10 shadow-sm uppercase">
                Limited
              </div>
              <div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-square bg-brand-brown/5">
                <img 
                  src="https://images.unsplash.com/photo-1621236378699-8597faf6a176?q=80&w=800&auto=format&fit=crop" 
                  alt="Blush Rose Bento" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">Blush Rose Bento</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">Sentuhan floral untuk momen manis.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4">
              <div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-[4/3] bg-brand-brown/5">
                <img 
                  src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop" 
                  alt="Artisanal Selection" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">Artisanal Selection</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">Pilihan ragam rasa untuk dinikmati bersama.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Banner Section */}
      <section className="w-full max-w-7xl px-4 md:px-16 py-12 md:py-20 mb-8 md:mb-12">
        <motion.div 
          className="bg-brand-light-cream rounded-2xl md:rounded-3xl p-6 md:p-16 flex flex-col items-center text-center gap-4 md:gap-6 border border-brand-brown/5 shadow-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="font-serif text-2xl md:text-4xl font-bold">Sistem Pemesanan Mudah via WhatsApp</h2>
          <p className="text-brand-gray max-w-xl text-xs md:text-base leading-relaxed">
            Pesan langsung dengan tim kami untuk memastikan kue Anda dibuat sesuai keinginan. Konsultasi desain dan rasa tersedia.
          </p>
          <a 
            href="https://wa.me/6285718314942?text=Halo%20Admin%20It's%20Tasty,%20saya%20mau%20konsultasi%20pesanan%20kue" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 md:mt-4 flex items-center gap-2 bg-transparent border-2 border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-brand-cream font-medium px-6 py-2.5 md:px-8 md:py-3 rounded-full transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            <MessageSquare className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            Hubungi Kami
          </a>
        </motion.div>
      </section>
    </div>
  );
}
