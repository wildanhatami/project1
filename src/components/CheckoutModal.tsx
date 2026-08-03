"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import {
  X,
  ShoppingBag,
  Store,
  Clock,
  Send,
  QrCode,
  Wallet,
  Landmark,
  CalendarDays,
  LogIn,
  Copy,
  Check,
} from "lucide-react";
import type { Product } from "@/lib/notion";
import {
  WA_NUMBER,
  STORE_SCHEDULE,
  STORE_ADDRESS,
  PAYMENT_METHODS,
} from "@/lib/store-config";
import Image from "next/image";

type OrderMethod = "preorder" | "instore";
type PaymentMethod = "qris" | "ewallet" | "bank";

interface CheckoutProps {
  product: Product;
  selectedSizeIdx: number;
  onClose: () => void;
}

export default function CheckoutModal({
  product,
  selectedSizeIdx,
  onClose,
}: CheckoutProps) {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [orderMethod, setOrderMethod] = useState<OrderMethod>("preorder");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [showQRIS, setShowQRIS] = useState(false);

  const selectedSize =
    product.sizes[selectedSizeIdx] || product.sizes[0] || { size: "-", price: 0 };
  const formattedPrice = selectedSize.price.toLocaleString("id-ID");

  const orderMethodLabel =
    orderMethod === "preorder" ? "Pre-Order (PO)" : "Datang Langsung ke Toko";

  const paymentLabel =
    paymentMethod === "qris"
      ? "QRIS"
      : paymentMethod === "ewallet"
      ? "E-Wallet"
      : "Transfer Bank";

  const waText = [
    `Halo Admin It's Tasty! Saya mau pesan:`,
    ``,
    `🍰 Produk: ${product.name}`,
    `📏 Ukuran: ${selectedSize.size}`,
    `💰 Harga: Rp ${formattedPrice}`,
    `🛵 Metode Pengambilan: ${orderMethodLabel}`,
    `💳 Metode Pembayaran: ${paymentLabel}`,
    ``,
    `Terima kasih!`,
  ].join("\n");

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-brand-brown/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92dvh] md:max-h-[85dvh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-brand-brown/8 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-terracotta/10 flex items-center justify-center">
                <ShoppingBag size={17} className="text-brand-terracotta" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-brown">
                Checkout Pesanan
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-brand-light-cream text-brand-gray flex items-center justify-center hover:bg-brand-brown/10 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-5 md:space-y-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-6">
            {!isLoggedIn ? (
              /* ===== Belum Login ===== */
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-light-cream flex items-center justify-center">
                  <LogIn size={22} className="text-brand-terracotta" />
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-brand-brown">
                    Masuk dulu yuk!
                  </p>
                  <p className="text-sm text-brand-gray mt-1 leading-relaxed">
                    Login dengan akun Google untuk melanjutkan pemesanan.
                  </p>
                </div>
                <button
                  onClick={() => signIn("google")}
                  className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-medium py-3.5 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  Masuk dengan Google
                </button>
              </div>
            ) : (
              <>
                {/* Ringkasan Produk */}
                <div className="flex items-center gap-3 md:gap-4 bg-brand-light-cream rounded-2xl p-3 md:p-4">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-gray text-xs shrink-0">
                      No Img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-brown truncate">
                      {product.name}
                    </p>
                    <p className="text-xs md:text-sm text-brand-gray">
                      Ukuran {selectedSize.size}
                    </p>
                  </div>
                  <p className="font-serif font-bold text-brand-terracotta whitespace-nowrap text-sm md:text-base">
                    Rp {formattedPrice}
                  </p>
                </div>

                {/* ===== Metode Pengambilan ===== */}
                <div>
                  <label className="block text-sm font-semibold text-brand-brown mb-2.5">
                    Metode Pengambilan
                  </label>
                  <div className="space-y-2.5">
                    <MethodOption
                      active={orderMethod === "preorder"}
                      onClick={() => setOrderMethod("preorder")}
                      icon={<Store size={18} />}
                      title="Pre-Order (PO)"
                      description="Pesanan dibuat setelah kamu memesan, siap diambil sesuai kesepakatan."
                    />
                    <MethodOption
                      active={orderMethod === "instore"}
                      onClick={() => setOrderMethod("instore")}
                      icon={<ShoppingBag size={18} />}
                      title="Datang Langsung ke Toko"
                      description="Ambil langsung di toko saat stok tersedia."
                    />
                  </div>

                  {orderMethod === "instore" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 rounded-2xl border border-brand-terracotta/20 bg-brand-light-cream p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-terracotta mb-2">
                        Jadwal Operasional Toko
                      </p>
                      <div className="flex items-start gap-2.5 text-sm text-brand-brown">
                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-brand-terracotta" />
                        <span>
                          Buka hari{" "}
                          <span className="font-semibold">
                            {STORE_SCHEDULE.days.join(", ")}
                          </span>{" "}
                          mulai pukul{" "}
                          <span className="font-semibold">
                            {STORE_SCHEDULE.openTime}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-sm text-brand-gray mt-2">
                        <Clock size={16} className="mt-0.5 shrink-0 text-brand-terracotta" />
                        <span>
                          {STORE_SCHEDULE.note} Alamat: {STORE_ADDRESS}.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* ===== Metode Pembayaran ===== */}
                <div>
                  <label className="block text-sm font-semibold text-brand-brown mb-2.5">
                    Metode Pembayaran
                  </label>
                  <div className="space-y-2.5">
                    <MethodOption
                      active={paymentMethod === "qris"}
                      onClick={() => setPaymentMethod("qris")}
                      icon={<QrCode size={18} />}
                      title={PAYMENT_METHODS.qris.label}
                      description={PAYMENT_METHODS.qris.description}
                    />
                    <MethodOption
                      active={paymentMethod === "ewallet"}
                      onClick={() => setPaymentMethod("ewallet")}
                      icon={<Wallet size={18} />}
                      title={PAYMENT_METHODS.ewallet.label}
                      description="DANA, OVO, GoPay — transfer lalu konfirmasi pembayaran."
                    />
                    <MethodOption
                      active={paymentMethod === "bank"}
                      onClick={() => setPaymentMethod("bank")}
                      icon={<Landmark size={18} />}
                      title={PAYMENT_METHODS.bank.label}
                      description="Transfer ke rekening bank lalu konfirmasi pembayaran."
                    />
                  </div>

                  {/* Detail pembayaran sesuai pilihan */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === "qris" && (
                      <motion.div
                        key="qris"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 rounded-2xl border border-brand-brown/10 p-4 flex items-center gap-4"
                      >
                        <button
                          onClick={() => setShowQRIS(true)}
                          className="relative shrink-0 group"
                          title="Klik untuk memperbesar"
                        >
                          <Image
                            src={PAYMENT_METHODS.qris.imagePath}
                            alt="QRIS It's Tasty"
                            width={96}
                            height={96}
                            className="rounded-xl border border-brand-brown/10 object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute inset-0 rounded-xl bg-brand-brown/0 group-hover:bg-brand-brown/10 transition-colors flex items-center justify-center">
                            <QrCode size={20} className="text-white opacity-0 group-hover:opacity-100" />
                          </span>
                        </button>
                        <div className="text-xs text-brand-gray leading-relaxed">
                          <p className="font-semibold text-brand-brown text-sm mb-1">
                            Scan QRIS di atas
                          </p>
                          <p>{PAYMENT_METHODS.qris.description}</p>
                          <button
                            onClick={() => setShowQRIS(true)}
                            className="mt-2 text-brand-terracotta font-semibold hover:text-brand-terracotta-hover transition-colors"
                          >
                            Lihat QRIS lebih besar →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "ewallet" && (
                      <PaymentDetails
                        key="ewallet"
                        items={PAYMENT_METHODS.ewallet.accounts.map((a) => ({
                          label: a.name,
                          value: a.number,
                          extra: a.holder,
                        }))}
                      />
                    )}

                    {paymentMethod === "bank" && (
                      <PaymentDetails
                        key="bank"
                        items={PAYMENT_METHODS.bank.accounts.map((a) => ({
                          label: `Bank ${a.bank}`,
                          value: a.number,
                          extra: a.holder,
                        }))}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* ===== Tombol Lanjut ===== */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  <Send size={17} />
                  Lanjutkan ke WhatsApp
                </a>
                <p className="text-center text-[11px] text-brand-gray/70">
                  Pesanan akan dikonfirmasi admin via WhatsApp.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ===== Modal QRIS ===== */}
      <AnimatePresence>
        {showQRIS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-brown/50 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowQRIS(false)}
          >
<motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg font-bold text-brand-brown">
                    Pembayaran QRIS
                  </h4>
                  <button
                    onClick={() => setShowQRIS(false)}
                    className="w-8 h-8 rounded-full bg-brand-light-cream text-brand-gray flex items-center justify-center hover:bg-brand-brown/10 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
                <Image
                  src={PAYMENT_METHODS.qris.imagePath}
                  alt="QRIS It's Tasty"
                  width={224}
                  height={224}
                  className="mx-auto rounded-2xl border border-brand-brown/10 object-cover"
                />
                <p className="text-sm text-brand-gray mt-4 leading-relaxed">
                Scan QRIS di atas dengan aplikasi pembayaran (GoPay, OVO, DANA,
                ShopeePay, atau mobile banking) lalu konfirmasi pembayaran via
                WhatsApp.
              </p>
              <p className="text-[11px] text-brand-gray/60 mt-2">
                a.n. It&apos;s Tasty
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MethodOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3.5 text-left rounded-2xl border-2 p-4 transition-all ${
        active
          ? "border-brand-terracotta bg-brand-light-cream"
          : "border-brand-brown/10 hover:border-brand-brown/25"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          active
            ? "bg-brand-terracotta text-white"
            : "bg-brand-light-cream text-brand-gray"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-brown text-sm">{title}</p>
        <p className="text-xs text-brand-gray mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 transition-colors ${
          active
            ? "border-brand-terracotta bg-brand-terracotta"
            : "border-brand-brown/20"
        }`}
      />
    </button>
  );
}

function PaymentDetails({
  items,
}: {
  items: { label: string; value: string; extra?: string }[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-3 rounded-2xl border border-brand-brown/10 divide-y divide-brand-brown/8"
    >
      {items.map((item) => (
        <div key={item.label} className="p-3.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-gray">
              {item.label}
            </p>
            <p className="font-mono font-bold text-brand-brown tracking-wide break-all">
              {item.value}
            </p>
            {item.extra && (
              <p className="text-[11px] text-brand-gray">{item.extra}</p>
            )}
          </div>
          <button
            onClick={() => copy(item.value)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-terracotta hover:text-brand-terracotta-hover transition-colors shrink-0"
          >
            {copied === item.value ? (
              <>
                <Check size={13} className="text-green-600" />
                Tersalin
              </>
            ) : (
              <>
                <Copy size={13} />
                Salin
              </>
            )}
          </button>
        </div>
      ))}
    </motion.div>
  );
}
