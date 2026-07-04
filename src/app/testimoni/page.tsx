"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Star, MessageSquare, Mail, MapPin, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Amanda S.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Croissant dari It's Tasty adalah yang terbaik di kota ini! Flaky di luar, lembut di dalam. Sangat cocok menemani kopi pagi saya.",
    product: "ALMOND CROISSANT"
  },
  {
    id: 2,
    name: "Budi W.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    text: "Pesan kue ulang tahun custom di sini sangat memuaskan. Desainnya elegan, rasanya tidak terlalu manis, pas sekali di lidah keluarga.",
    product: "CUSTOM CAKE"
  },
  {
    id: 3,
    name: "Dina & Raka",
    avatar: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Sering mampir untuk beli sourdough. Teksturnya sempurna. Pelayanannya juga ramah dan hangat.",
    product: "CLASSIC SOURDOUGH"
  },
  {
    id: 4,
    name: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Bento cakenya lucu-lucu banget! Teman saya senang sekali pas dikasih ini buat kejutan ulang tahunnya.",
    product: "KOREAN BENTO CAKE"
  },
  {
    id: 5,
    name: "Kevin J.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Burnt cheesecake terenak yang pernah saya makan. Lumer di mulut dan kejunya sangat berasa, tapi gak bikin eneg.",
    product: "PREMIUM BURNT CHEESECAKE"
  },
  {
    id: 6,
    name: "Nadia T.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    text: "Pilihan rotinya selalu segar karena dipanggang tiap hari. Paling suka sama pain au chocolat-nya, the best!",
    product: "PAIN AU CHOCOLAT"
  },
  {
    id: 7,
    name: "Tirta & Family",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Hampers lebaran dari It's Tasty bikin kerabat keluarga pada nanya beli di mana. Kuenya enak dan packagingnya sangat mewah.",
    product: "FESTIVE HAMPERS"
  }
];

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

export default function Testimoni() {
  const [inquiryType, setInquiryType] = useState("Pesanan Custom Cake");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const inquiryOptions = [
    "Pesanan Custom Cake",
    "Corporate Hampers / Bulk Order",
    "Catering Dessert Box",
    "Lainnya"
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const waHref = `https://wa.me/6285718314942?text=Halo%20Admin%20It's%20Tasty,%20saya%20tertarik%20dengan%20${encodeURIComponent(inquiryType)}`;

  return (
    <div className="flex flex-col items-center w-full pt-10 md:pt-16 pb-16 md:pb-24">
      {/* Header */}
      <motion.div 
        className="text-center mb-12 md:mb-20 px-4 md:px-6 flex flex-col items-center gap-3 md:gap-4 max-w-2xl"
        initial="hidden" animate="visible" variants={fadeInUp}
      >
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-brand-brown">Cerita Manis Mereka</h1>
        <p className="text-brand-gray text-sm md:text-lg">
          Setiap gigitan membawa kebahagiaan. Temukan pengalaman pelanggan kami menikmati kreasi artisanal dari It's Tasty.
        </p>
      </motion.div>

      {/* Testimonials Carousel */}
      <div className="w-full max-w-7xl px-0 md:px-16 mb-20 md:mb-32 relative group">
        
        {/* Navigation Buttons (Desktop) */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-brand-brown/10 text-brand-brown p-3 rounded-full shadow-md hover:bg-brand-brown hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur border border-brand-brown/10 text-brand-brown p-3 rounded-full shadow-md hover:bg-brand-brown hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>

        {/* Scroll Container */}
        <motion.div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-8 pt-4 px-4 md:px-2 scroll-pl-4 md:scroll-pl-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          {testimonials.map((t) => (
            <motion.div 
              key={t.id} 
              variants={fadeInUp}
              className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start hover:shadow-md transition-shadow duration-300 shrink-0"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-medium text-brand-brown text-sm md:text-base">{t.name}</h3>
                  <div className="flex gap-1 mt-1 text-brand-terracotta">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} strokeWidth={i < t.rating ? 0 : 1.5} />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="italic text-brand-gray text-[14px] md:text-[15px] leading-relaxed flex-grow mb-8 whitespace-normal">
                "{t.text}"
              </p>

              <p className="text-[11px] font-semibold tracking-wider text-brand-gray/60 uppercase">
                {t.product}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom Order Inquiry Section */}
      <motion.section 
        className="w-full max-w-6xl px-4 md:px-16 flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex-1 w-full relative aspect-[4/3] lg:aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1000&auto=format&fit=crop" 
            alt="Custom Cakes Selection" 
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="flex-1 w-full bg-[#EAE3DB] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col gap-4 md:gap-6">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-brand-brown leading-tight">Butuh Kue Spesial?</h2>
          <p className="text-brand-gray text-xs md:text-base leading-relaxed">
            Untuk perayaan, acara korporat, atau sekadar memanjakan diri. Tim kami siap meracik kreasi khusus untuk momen berharga Anda.
          </p>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mt-2 md:mt-4 border border-brand-brown/5">
            <div className="flex items-center gap-3 text-brand-brown font-medium mb-4">
              <MessageSquare size={20} className="text-brand-terracotta" />
              Hubungi via WhatsApp
            </div>
            
            <label className="block text-xs font-medium text-brand-gray mb-2">Saya tertarik dengan...</label>
            <div className="relative mb-6">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-brand-light-cream border border-brand-brown/20 text-brand-brown text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta transition-colors"
              >
                <span>{inquiryType}</span>
                <ChevronDown size={16} className={`text-brand-gray transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 w-full mt-2 bg-white border border-brand-brown/10 rounded-xl shadow-lg overflow-hidden flex flex-col py-1"
                  >
                    {inquiryOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setInquiryType(opt);
                          setIsDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-brown/5 ${inquiryType === opt ? 'text-brand-terracotta font-medium bg-brand-brown/5' : 'text-brand-brown'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            <a 
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              Mulai Obrolan <MessageSquare size={16} className="ml-1" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-4 pt-6 border-t border-brand-brown/10">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-brand-gray shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-brand-gray/70 uppercase mb-0.5">Email Kami</p>
                <p className="text-sm font-medium text-brand-brown">hello@itstasty.id</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-gray shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-brand-gray/70 uppercase mb-0.5">Kunjungi Toko</p>
                <p className="text-sm font-medium text-brand-brown">Jl. Senopati No. 42, Jakarta</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
