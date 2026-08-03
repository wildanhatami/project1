"use client";

import { useState, useRef } from "react";
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
  Upload,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";
import type { CartItem } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
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
  items: CartItem[];
  onClose: () => void;
}

export default function CheckoutModal({
  items,
  onClose,
}: CheckoutProps) {
  const { data: session, status } = useSession();
  const { clearCart } = useCart();
  const isLoggedIn = status === "authenticated";

  const [orderMethod, setOrderMethod] = useState<OrderMethod>("preorder");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris");
  const [showQRIS, setShowQRIS] = useState(false);

  // Payment Proof & Flow State
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPrice = items.reduce((sum, item) => sum + item.size.price * item.quantity, 0);
  const formattedTotal = totalPrice.toLocaleString("id-ID");

  const orderMethodLabel =
    orderMethod === "preorder" ? "Pre-Order (PO)" : "Datang Langsung ke Toko";

  const paymentLabel =
    paymentMethod === "qris"
      ? "QRIS"
      : paymentMethod === "ewallet"
      ? "E-Wallet"
      : "Transfer Bank";

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg("Ukuran file bukti pembayaran maksimal 15MB");
        return;
      }
      setErrorMsg(null);
      setPaymentProof(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProof) {
      setErrorMsg("Harap unggah bukti pembayaran terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        size: i.size.size,
        quantity: i.quantity,
        price: i.size.price,
      }));

      const formData = new FormData();
      formData.append("customerName", session?.user?.name || "Pelanggan");
      formData.append("customerEmail", session?.user?.email || "");
      formData.append("totalAmount", String(totalPrice));
      formData.append("orderMethod", orderMethodLabel);
      formData.append("paymentMethod", paymentLabel);
      formData.append("items", JSON.stringify(orderItems));
      formData.append("paymentProof", paymentProof);

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mencatat pesanan");
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengirim pembayaran, silakan coba lagi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmWhatsApp = () => {
    const itemsListText = items
      .map(
        (item, idx) =>
          `${idx + 1}. 🍰 ${item.productName}\n` +
          `   📏 Ukuran: ${item.size.size}\n` +
          `   🔢 Jumlah: ${item.quantity}\n` +
          `   💰 Harga: Rp ${(item.size.price * item.quantity).toLocaleString("id-ID")}`
      )
      .join("\n\n");

    const waText = [
      `Halo Admin It's Tasty! Saya telah menyelesaikan pembayaran dan mengunggah bukti bayar:`,
      ``,
      itemsListText,
      ``,
      `💰 Total: Rp ${formattedTotal}`,
      `🛵 Metode Pengambilan: ${orderMethodLabel}`,
      `💳 Metode Pembayaran: ${paymentLabel}`,
      `📸 Bukti Pembayaran: [Sudah Diunggah via Web]`,
      ``,
      `Mohon diproses ya min, terima kasih!`,
    ].join("\n");

    const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in a new tab
    window.open(waHref, "_blank", "noopener,noreferrer");

    // Clear cart and close modal
    clearCart();
    onClose();
  };

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
                {isSuccess ? (
                  <CheckCircle2 size={17} className="text-green-600" />
                ) : (
                  <ShoppingBag size={17} className="text-brand-terracotta" />
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-brown">
                {isSuccess ? "Pembayaran Berhasil" : "Checkout Pembayaran"}
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
            ) : isSuccess ? (
              /* ===== Success Confirmation State ===== */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center space-y-5"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-brand-brown">
                    Pembayaran Berhasil Diterima!
                  </h4>
                  <p className="text-sm text-brand-gray mt-2 leading-relaxed max-w-sm mx-auto">
                    Terima kasih telah melakukan pembayaran. Klik tombol di bawah ini untuk mengirimkan rincian pesanan dan bukti bayar ke WhatsApp Admin.
                  </p>
                </div>

                <div className="bg-brand-light-cream rounded-2xl p-4 border border-brand-brown/8 text-left space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-brown/70">
                    Ringkasan Order
                  </p>
                  <div className="flex justify-between text-sm text-brand-brown">
                    <span>Jumlah Item ({items.length})</span>
                    <span className="font-semibold">Rp {formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-brown">
                    <span>Metode</span>
                    <span className="font-semibold">{paymentLabel} ({orderMethodLabel})</span>
                  </div>
                  {paymentProof && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg mt-2">
                      <FileText size={14} />
                      <span className="truncate">{paymentProof.name}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-md text-base cursor-pointer"
                >
                  <Send size={18} />
                  Konfirmasi via WhatsApp
                </button>

                <p className="text-[11px] text-brand-gray/70">
                  Keranjang kamu akan otomatis dikosongkan setelah konfirmasi.
                </p>
              </motion.div>
            ) : (
              /* ===== Checkout & Payment Submission Form ===== */
              <form onSubmit={handleSubmitPayment} className="space-y-5 md:space-y-6">
                {/* Ringkasan Produk */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-brand-brown">
                    Ringkasan Pesanan
                  </label>
                  <div className="max-h-[160px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-brand-brown/10">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.size.size}`}
                        className="flex items-center gap-3 bg-brand-light-cream rounded-2xl p-3"
                      >
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={48}
                            height={48}
                            style={{ width: "auto", height: "auto" }}
                            className="rounded-xl object-cover shrink-0 w-12 h-12"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-brand-brown/10 flex items-center justify-center text-brand-gray text-[10px] shrink-0">
                            No Img
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-brown text-sm truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-brand-gray">
                            Ukuran {item.size.size} ({item.quantity}x)
                          </p>
                        </div>
                        <p className="font-serif font-bold text-brand-terracotta whitespace-nowrap text-sm">
                          Rp {(item.size.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Bayar */}
                <div className="flex justify-between items-center bg-brand-light-cream/50 px-4 py-3 rounded-xl border border-brand-brown/5">
                  <span className="text-sm font-medium text-brand-brown">Total Pembayaran</span>
                  <span className="font-serif font-bold text-brand-terracotta text-lg">
                    Rp {formattedTotal}
                  </span>
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
                      description="DANA, OVO, GoPay — transfer lalu unggah bukti pembayaran."
                    />
                    <MethodOption
                      active={paymentMethod === "bank"}
                      onClick={() => setPaymentMethod("bank")}
                      icon={<Landmark size={18} />}
                      title={PAYMENT_METHODS.bank.label}
                      description="Transfer ke rekening bank lalu unggah bukti pembayaran."
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
                          type="button"
                          onClick={() => setShowQRIS(true)}
                          className="relative shrink-0 group"
                          title="Klik untuk memperbesar"
                        >
                          <Image
                            src={PAYMENT_METHODS.qris.imagePath}
                            alt="QRIS It's Tasty"
                            width={96}
                            height={96}
                            style={{ width: "auto", height: "auto" }}
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
                            type="button"
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

                {/* ===== Upload Bukti Pembayaran ===== */}
                <div>
                  <label className="block text-sm font-semibold text-brand-brown mb-2">
                    Unggah Bukti Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full cursor-pointer"
                  >
                    {paymentProofPreview ? (
                      <div className="relative aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden bg-brand-brown/5 border border-brand-brown/15 p-2 flex items-center justify-center">
                        <Image
                          src={paymentProofPreview}
                          alt="Bukti Bayar"
                          fill
                          className="object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentProof(null);
                            setPaymentProofPreview(null);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed border-brand-brown/20 bg-brand-light-cream p-5 flex flex-col items-center justify-center gap-2 text-center hover:border-brand-terracotta/50 transition-colors">
                        <Upload size={24} className="text-brand-terracotta" />
                        <span className="text-sm font-semibold text-brand-brown">
                          Pilih Foto Bukti Pembayaran
                        </span>
                        <span className="text-xs text-brand-gray">
                          JPG, PNG, WebP (Maks 15MB)
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleProofChange}
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{errorMsg}</p>
                  )}
                </div>

                {/* ===== Tombol Submit Pembayaran ===== */}
                <button
                  type="submit"
                  disabled={isSubmitting || !paymentProof}
                  className="w-full flex items-center justify-center gap-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white font-semibold py-4 rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memproses Pembayaran...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Kirim Pembayaran & Lanjutkan
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-brand-gray/70">
                  Setelah kirim, kamu bisa langsung mengonfirmasi pesanan ke WhatsApp Admin.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ===== Modal QRIS Perbesar ===== */}
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
                  type="button"
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
                style={{ width: "auto", height: "auto" }}
                className="mx-auto rounded-2xl border border-brand-brown/10 object-cover"
              />
              <p className="text-sm text-brand-gray mt-4 leading-relaxed">
                Scan QRIS di atas dengan aplikasi pembayaran (GoPay, OVO, DANA,
                ShopeePay, atau mobile banking) lalu unggah bukti pembayaran.
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
      type="button"
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
            type="button"
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
