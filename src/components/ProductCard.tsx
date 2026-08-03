"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/notion";
import CheckoutModal from "./CheckoutModal";
import Image from "next/image";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProductCard({ product }: { product: Product }) {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Safely fallback if sizes array is somehow empty
  const selectedSize = product.sizes[selectedSizeIdx] || { size: "10cm", price: 0 };

  const formattedPrice = selectedSize.price.toLocaleString("id-ID");

  return (
    <motion.div variants={fadeInUp} className="flex flex-col group h-full">
<div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-[4/5] bg-brand-brown/5 relative mb-3 md:mb-6">
        {product.isBestseller && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-light-cream text-brand-terracotta text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10 shadow-sm uppercase tracking-wider">
            Terlaris
          </div>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center text-brand-gray text-xs md:text-sm">No Image</div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow text-center px-1 md:px-2">
        <h3 className="font-serif text-lg md:text-2xl font-medium mb-1 md:mb-2 text-brand-brown leading-tight">{product.name}</h3>
        <p className="text-brand-gray text-[10px] md:text-sm mb-3 md:mb-6 flex-grow line-clamp-3 md:line-clamp-none">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3 mb-3 md:mb-6">
            {product.sizes.map((sizeOpt, idx) => (
              <button
                key={sizeOpt.size}
                onClick={() => setSelectedSizeIdx(idx)}
                className={`px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-sm font-medium transition-all duration-300 border ${
                  selectedSizeIdx === idx 
                    ? "bg-brand-brown text-brand-cream border-brand-brown" 
                    : "bg-transparent text-brand-gray border-brand-brown/20 hover:border-brand-brown/50"
                }`}
              >
                {sizeOpt.size}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="font-serif text-base md:text-3xl font-bold text-brand-terracotta mb-3 md:mb-6">
          Rp {formattedPrice}
        </p>

        {/* Order Button -> Checkout Modal */}
        <button
          onClick={() => setCheckoutOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 md:gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-2 md:py-3.5 rounded-lg md:rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm text-[11px] md:text-base"
        >
          <ShoppingBag className="w-3.5 h-3.5 md:w-5 md:h-5" />
          <span className="hidden md:inline">Pesan Sekarang</span>
          <span className="md:hidden">Pesan</span>
        </button>
      </div>

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            product={product}
            selectedSizeIdx={selectedSizeIdx}
            onClose={() => setCheckoutOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
