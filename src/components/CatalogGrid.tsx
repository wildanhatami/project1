"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/notion";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const ITEMS_PER_PAGE = 8;

export default function CatalogGrid({ products }: { products: Product[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-20 text-brand-gray">
        Belum ada produk yang aktif. Silakan tambahkan di Notion.
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll smoothly to top of the grid when page changes
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div 
        className="w-full max-w-7xl px-4 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 gap-y-10 lg:gap-y-12 mb-20"
        initial="hidden" animate="visible" variants={staggerContainer}
        key={currentPage} // This key forces framer-motion to re-animate when page changes
      >
        {currentProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} isPriority={idx < 4} />
        ))}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mb-16">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-brown/20 text-brand-brown hover:bg-brand-brown hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-brown"
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                  currentPage === page
                    ? "bg-brand-brown text-white shadow-md"
                    : "text-brand-brown hover:bg-brand-brown/10"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-brown/20 text-brand-brown hover:bg-brand-brown hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-brown"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
