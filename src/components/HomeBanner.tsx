"use client";

import { motion, Variants } from "framer-motion";
import { MessageSquare } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomeBanner() {
  return (
    <section className="w-full max-w-7xl px-4 md:px-16 py-12 md:py-20 mb-8 md:mb-12">
      <motion.div 
        className="bg-brand-light-cream rounded-2xl md:rounded-3xl p-6 md:p-16 flex flex-col items-center text-center gap-4 md:gap-6 border border-brand-brown/5 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="font-serif text-2xl md:text-4xl font-bold">Order Pesananmu via WhatsApp</h2>
        <p className="text-brand-gray max-w-xl text-xs md:text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
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
  );
}
