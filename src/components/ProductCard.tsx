"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/lib/notion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProductCard({ product, isPriority }: { product: Product; isPriority?: boolean }) {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  // Safely fallback if sizes array is somehow empty
  const selectedSize = product.sizes[selectedSizeIdx] || { size: "10cm", price: 0 };

  const formattedPrice = selectedSize.price.toLocaleString("id-ID");

  const handleAddToCart = () => {
    addToCart(product, selectedSizeIdx);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
            priority={isPriority}
            loading={isPriority ? undefined : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center text-brand-gray text-xs md:text-sm">No Image</div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow text-center px-1 md:px-2">
        <h3 className="font-serif text-base md:text-xl font-medium mb-1 md:mb-2 text-brand-brown leading-tight">{product.name}</h3>
        <p className="text-brand-gray text-xs md:text-sm mb-3 md:mb-5 flex-grow line-clamp-2">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mb-3 md:mb-5">
            {product.sizes.map((sizeOpt, idx) => (
              <button
                key={sizeOpt.size}
                onClick={() => setSelectedSizeIdx(idx)}
                className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium transition-all duration-300 border ${
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
        <p className="font-serif text-lg md:text-2xl font-bold text-brand-terracotta mb-3 md:mb-5">
          Rp {formattedPrice}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-1.5 md:gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-2 md:py-3 rounded-lg md:rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm text-xs md:text-sm"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Ditambahkan!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Tambah ke Keranjang</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}