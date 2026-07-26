"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

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

export default function HomeHero() {
  return (
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
          Kue Pilihan <br /> untuk Hari <br /> Terbaikmu
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          className="text-brand-gray text-sm md:text-lg max-w-md"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
  );
}
