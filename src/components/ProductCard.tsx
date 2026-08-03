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
      <div className="overflow-hidden rounded-xl md:rounded-2xl w-full aspect-[4/5] bg-brand-brown/5 relative mb-2 md:mb-5">
        {product.isBestseller && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-light-cream text-brand-terracotta text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full z-10 shadow-xs uppercase tracking-wider">
            Terlaris
          </div>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y3ZjNlZSIgLz48L3N2Zz4="
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={isPriority}
            loading={isPriority ? undefined : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center text-brand-gray text-[10px] md:text-xs">No Image</div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow text-center px-0.5 sm:px-1 md:px-2">
        <h3 className="font-serif text-xs sm:text-sm md:text-lg font-semibold mb-0.5 md:mb-1.5 text-brand-brown leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-brand-gray text-[10px] sm:text-xs md:text-sm mb-2 md:mb-4 flex-grow line-clamp-2 leading-snug">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-1.5 mb-2 md:mb-4">
            {product.sizes.map((sizeOpt, idx) => (
              <button
                key={sizeOpt.size}
                onClick={() => setSelectedSizeIdx(idx)}
                className={`px-1.5 py-0.5 sm:px-2 md:px-3 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-300 border ${
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
        <p className="font-serif text-sm sm:text-base md:text-xl font-bold text-brand-terracotta mb-2 md:mb-4">
          Rp {formattedPrice}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-1 sm:gap-1.5 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-1.5 sm:py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xs text-[11px] sm:text-xs md:text-sm"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Ditambahkan!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate">Tambah Keranjang</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}