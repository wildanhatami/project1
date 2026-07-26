"use client";

import { motion, Variants } from "framer-motion";
import { Product } from "@/lib/notion";

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

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fb-1",
    name: "Classic Burnt Cheesecake",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
    isBestseller: false,
    sizes: [{ size: "14cm", price: 185000 }],
  },
  {
    id: "fb-2",
    name: "Blush Rose Bento",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?q=80&w=800&auto=format&fit=crop",
    isBestseller: true,
    sizes: [{ size: "10cm", price: 95000 }],
  },
  {
    id: "fb-3",
    name: "Dark Cocoa Layers",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop",
    isBestseller: false,
    sizes: [{ size: "10cm", price: 95000 }],
  },
  {
    id: "fb-4",
    name: "Artisanal Selection",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop",
    isBestseller: false,
    sizes: [{ size: "14cm", price: 210000 }],
  },
];

export default function HomeGallery({ products }: { products: Product[] }) {
  const displayProducts = products && products.length > 0 ? products.slice(0, 4) : FALLBACK_PRODUCTS;

  const leftColumn = displayProducts.filter((_, i) => i % 2 === 0);
  const rightColumn = displayProducts.filter((_, i) => i % 2 === 1);

  return (
    <section className="w-full max-w-7xl px-4 md:px-16 py-16 md:py-24 flex flex-col items-center border-t border-brand-brown/10">
      <motion.div 
        className="text-center mb-10 md:mb-16 flex flex-col items-center gap-2 md:gap-4 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <h2 className="font-serif text-2xl md:text-4xl font-bold">Koleksi Menu Kami</h2>
        <p className="text-brand-gray text-xs md:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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
          {leftColumn.map((product, idx) => (
            <motion.div key={product.id || idx} variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4 relative">
              {product.isBestseller && (
                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-light-cream text-brand-terracotta text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10 shadow-sm uppercase">
                  Terlaris
                </div>
              )}
              <div className={`overflow-hidden rounded-xl md:rounded-2xl w-full ${idx === 0 ? "aspect-[4/3]" : "aspect-square"} bg-brand-brown/5`}>
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"} 
                  alt={product.name} 
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">{product.name}</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">{product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column */}
        <motion.div 
          className="flex flex-col gap-6 md:gap-12 md:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {rightColumn.map((product, idx) => (
            <motion.div key={product.id || idx} variants={fadeInUp} className="group cursor-pointer flex flex-col gap-2 md:gap-4 relative">
              {product.isBestseller && (
                <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-brand-light-cream text-brand-terracotta text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full z-10 shadow-sm uppercase">
                  Terlaris
                </div>
              )}
              <div className={`overflow-hidden rounded-xl md:rounded-2xl w-full ${idx === 0 ? "aspect-square" : "aspect-[4/3]"} bg-brand-brown/5`}>
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"} 
                  alt={product.name} 
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center md:text-left px-1">
                <h3 className="font-serif text-sm md:text-2xl font-medium mb-1 group-hover:text-brand-terracotta transition-colors leading-tight">{product.name}</h3>
                <p className="text-brand-gray text-[10px] md:text-sm leading-snug line-clamp-2 md:line-clamp-none">{product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
