"use client";

import { motion, Variants } from "framer-motion";
import { Droplet, Heart, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function TentangKami() {
  return (
    <div className="flex flex-col items-center w-full pt-10 md:pt-16 pb-16 md:pb-24">
      {/* Brand Story Section */}
      <section className="w-full max-w-7xl px-6 md:px-16 flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20 md:mb-28">
        <motion.div 
          className="flex-1 flex flex-col gap-4 md:gap-6"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-brand-brown leading-[1.1]">
            Kisah di Balik <br className="hidden md:block" /> It's Tasty
          </motion.h1>
          <motion.div variants={fadeInUp} className="w-12 md:w-16 h-1 bg-brand-terracotta/30 rounded-full my-1 md:my-2" />
          <motion.p variants={fadeInUp} className="text-brand-gray text-sm md:text-lg leading-relaxed">
            Berawal dari kecintaan pada seni meracik rasa dan keindahan visual, It's Tasty hadir untuk membawa kebahagiaan kecil di setiap perayaanmu.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-brand-gray text-sm md:text-lg leading-relaxed">
            Kami fokus menghadirkan Bento Cake ala Korea dan Premium Burnt Cheesecake yang tidak hanya cantik dipandang, tapi juga lumer di mulut. Setiap kue dipanggang setiap hari dengan bahan-bahan premium pilihan dan sentuhan personal.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex-1 w-full relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl border border-brand-brown/5">
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop" 
              alt="Baker piping frosting on a cake" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-[1.5s]"
            />
          </div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="w-full bg-[#FAF6EE] py-16 md:py-24 mb-16 md:mb-20 border-y border-brand-brown/5">
        <motion.div 
          className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          {/* Value 1 */}
          <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-sm border border-brand-brown/5 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F4EDE4] rounded-2xl flex items-center justify-center text-brand-brown mb-4 md:mb-6">
              <Droplet className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-brand-brown mb-2 md:mb-3">Bahan Premium</h3>
            <p className="text-brand-gray text-xs md:text-[15px] leading-relaxed">
              Hanya menggunakan butter, cream, dan cokelat berkualitas tinggi untuk tekstur dan rasa terbaik.
            </p>
          </motion.div>

          {/* Value 2 */}
          <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-sm border border-brand-brown/5 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F4EDE4] rounded-2xl flex items-center justify-center text-brand-brown mb-4 md:mb-6">
              <Heart className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-brand-brown mb-2 md:mb-3">Dibuat dengan Cinta</h3>
            <p className="text-brand-gray text-xs md:text-[15px] leading-relaxed">
              100% homemade, dipanggang setiap hari untuk memastikan kesegaran di setiap gigitan.
            </p>
          </motion.div>

          {/* Value 3 */}
          <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 md:p-10 flex flex-col items-center text-center shadow-sm border border-brand-brown/5 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F4EDE4] rounded-2xl flex items-center justify-center text-brand-brown mb-4 md:mb-6">
              <Palette className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-brand-brown mb-2 md:mb-3">Desain Personal</h3>
            <p className="text-brand-gray text-xs md:text-[15px] leading-relaxed">
              Bebas kreasikan desain bento cake impianmu untuk momen yang tak terlupakan.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Banner */}
      <section className="w-full max-w-5xl px-4 md:px-16">
        <motion.div 
          className="bg-[#F8EFE6] rounded-3xl md:rounded-[2.5rem] p-6 md:p-20 flex flex-col items-center text-center shadow-sm border border-brand-brown/5"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        >
          <h2 className="font-serif text-lg md:text-5xl font-bold text-brand-brown mb-5 md:mb-8 max-w-2xl leading-snug md:leading-tight">
            Mari rayakan momen spesialmu bersama It's Tasty.
          </h2>
          <Link 
            href="/katalog"
            className="group flex items-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium px-5 py-2.5 md:px-10 md:py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm text-[13px] md:text-lg"
          >
            Pesan Sekarang
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
