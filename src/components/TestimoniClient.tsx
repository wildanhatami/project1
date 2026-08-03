"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Testimonial } from "@/lib/notion";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mt-1 text-brand-terracotta">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} strokeWidth={i < rating ? 0 : 1.5} />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start hover:shadow-md transition-shadow duration-300 shrink-0"
    >
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        {t.avatar ? (
          <Image
            src={t.avatar}
            alt={t.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-brand-brown/10 flex items-center justify-center text-brand-gray text-xs shrink-0">
            No Img
          </div>
        )}
        <div>
          <h3 className="font-medium text-brand-brown text-sm md:text-base">{t.name}</h3>
          <StarRating rating={t.rating} />
        </div>
      </div>

      <p className="italic text-brand-gray text-[14px] md:text-[15px] leading-relaxed flex-grow mb-8 whitespace-normal">
        &quot;{t.text}&quot;
      </p>

      {t.product && (
        <p className="text-[11px] font-semibold tracking-wider text-brand-gray/60 uppercase">
          {t.product}
        </p>
      )}
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-brand-brown/5 flex flex-col w-[80vw] max-w-[300px] md:max-w-none md:w-[420px] snap-start shrink-0 animate-pulse">
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-brown/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-brand-brown/10 rounded w-24" />
          <div className="h-3 bg-brand-brown/5 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 flex-grow">
        <div className="h-3 bg-brand-brown/5 rounded w-full" />
        <div className="h-3 bg-brand-brown/5 rounded w-3/4" />
        <div className="h-3 bg-brand-brown/5 rounded w-5/6" />
      </div>
      <div className="h-3 bg-brand-brown/5 rounded w-20 mt-8" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-brand-light-cream flex items-center justify-center">
        <MessageSquare size={24} className="text-brand-gray" />
      </div>
      <p className="font-semibold text-brand-brown">Belum ada testimoni</p>
      <p className="text-sm text-brand-gray">Testimoni pelanggan akan ditampilkan di sini.</p>
    </div>
  );
}

export default function TestimoniClient({ testimonials }: { testimonials: Testimonial[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inquiryType, setInquiryType] = useState("Pesanan Custom Cake");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inquiryOptions = [
    "Pesanan Custom Cake",
    "Corporate Hampers / Bulk Order",
    "Catering Dessert Box",
    "Lainnya",
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
        {testimonials.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-8 pt-4 px-4 md:px-2 scroll-pl-4 md:scroll-pl-2 no-scrollbar"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}