"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartModal() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();
  const formattedTotal = totalPrice.toLocaleString("id-ID");

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-brand-brown/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
        onClick={closeCart}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92dvh] md:max-h-[85dvh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-brand-brown/8 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-terracotta/10 flex items-center justify-center">
                <ShoppingBag size={17} className="text-brand-terracotta" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-brown">
                Keranjang ({items.length})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-brand-light-cream text-brand-gray flex items-center justify-center hover:bg-brand-brown/10 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-24">
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-light-cream flex items-center justify-center">
                  <ShoppingBag size={24} className="text-brand-gray" />
                </div>
                <p className="font-semibold text-brand-brown">Keranjang kosong</p>
                <p className="text-sm text-brand-gray">Tambahkan kue favoritmu di sini</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.size.size}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-3 md:gap-4 bg-brand-light-cream rounded-2xl p-3 md:p-4"
                  >
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={64}
                        height={64}
                        style={{ width: "auto", height: "auto" }}
                        className="rounded-xl object-cover shrink-0 w-16 h-16 md:w-20 md:h-20"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-gray text-xs shrink-0">
                        No Img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-brown truncate">{item.productName}</p>
                      <p className="text-xs text-brand-gray">Ukuran: {item.size.size}</p>
                      <p className="font-serif font-bold text-brand-terracotta text-sm mt-1">
                        Rp {(item.size.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 border border-brand-brown/20 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-brand-brown hover:bg-brand-brown/10 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-medium text-brand-brown">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-brand-brown hover:bg-brand-brown/10 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size.size)}
                        className="text-brand-gray hover:text-red-500 transition-colors p-1"
                        title="Hapus item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Total & Checkout */}
                <div className="border-t border-brand-brown/10 pt-4 space-y-4">
                  <div className="flex justify-between text-brand-brown">
                    <span className="font-semibold">Total</span>
                    <span className="font-serif font-bold text-brand-terracotta text-lg">
                      Rp {formattedTotal}
                    </span>
                  </div>
                  <button
                    onClick={() => setCheckoutOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <ArrowRight size={17} />
                    Lanjut ke Pembayaran
                  </button>
                  <p className="text-center text-[11px] text-brand-gray/70">
                    Pesanan akan dikonfirmasi admin via WhatsApp.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            items={items}
            onClose={() => setCheckoutOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}