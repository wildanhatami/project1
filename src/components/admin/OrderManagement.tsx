"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Eye,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Loader2,
  CalendarDays,
  CreditCard,
  User,
  Mail,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/notion";
import Image from "next/image";

interface OrderManagementProps {
  initialOrders: Order[];
}

export default function OrderManagement({ initialOrders }: OrderManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengupdate status");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setMessage({ type: "ok", text: "Status pesanan berhasil diperbarui!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal mengupdate status",
      });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Verified":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            message.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-brand-brown">
            Daftar Pesanan ({orders.length})
          </h3>
          <p className="text-xs text-brand-gray mt-0.5">
            Kelola status dan verifikasi bukti pembayaran pelanggan
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-brown/8 p-12 text-center text-brand-gray space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-light-cream flex items-center justify-center text-brand-brown/40">
            <ShoppingBag size={22} />
          </div>
          <p className="font-medium text-brand-brown">Belum ada pesanan masuk</p>
          <p className="text-xs text-brand-gray">Pesanan pelanggan akan otomatis tercatat di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-brand-brown/8 p-5 md:p-6 space-y-4 shadow-sm"
            >
              {/* Header Card Order */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-brown/8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-light-cream flex items-center justify-center text-brand-terracotta shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-brown text-base">
                      {order.customerName}
                    </h4>
                    {order.customerEmail && (
                      <p className="text-xs text-brand-gray flex items-center gap-1">
                        <Mail size={12} /> {order.customerEmail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-colors ${statusBadge(
                        order.status
                      )}`}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Verified">✓ Verified</option>
                      <option value="Completed">🎉 Completed</option>
                      <option value="Cancelled">✕ Cancelled</option>
                    </select>
                    {updatingId === order.id && (
                      <Loader2 size={12} className="animate-spin absolute right-2 top-2 text-brand-gray" />
                    )}
                  </div>

                  {/* Bukti Bayar Button */}
                  {order.paymentProofUrl ? (
                    <button
                      onClick={() => setSelectedProofUrl(order.paymentProofUrl)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-terracotta bg-brand-light-cream hover:bg-brand-brown/10 px-3 py-1.5 rounded-full border border-brand-terracotta/30 transition-colors"
                    >
                      <Eye size={13} />
                      Bukti Bayar
                    </button>
                  ) : (
                    <span className="text-[11px] text-brand-gray/60 italic">Tanpa Foto</span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">Item Pesanan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-light-cream/60 p-2.5 rounded-xl flex items-center justify-between text-xs text-brand-brown"
                    >
                      <div>
                        <span className="font-semibold">{item.productName}</span>
                        <span className="text-brand-gray ml-1.5">({item.size})</span>
                      </div>
                      <div className="font-mono">
                        {item.quantity}x — Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-brand-brown/8 text-xs text-brand-gray">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>Metode Ambil: <strong className="text-brand-brown">{order.orderMethod || "-"}</strong></span>
                  <span>Pembayaran: <strong className="text-brand-brown">{order.paymentMethod || "-"}</strong></span>
                </div>

                <div className="text-right">
                  <span className="text-brand-gray mr-2">Total Harga:</span>
                  <span className="font-serif text-lg font-bold text-brand-terracotta">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Bukti Bayar */}
      <AnimatePresence>
        {selectedProofUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-brown/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedProofUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-5 max-w-lg w-full text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-brand-brown">
                  Bukti Pembayaran Pelanggan
                </h4>
                <button
                  onClick={() => setSelectedProofUrl(null)}
                  className="w-8 h-8 rounded-full bg-brand-light-cream text-brand-gray flex items-center justify-center hover:bg-brand-brown/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative aspect-[3/4] max-h-[60vh] w-full rounded-2xl overflow-hidden bg-brand-brown/5 border border-brand-brown/10">
                <Image
                  src={selectedProofUrl}
                  alt="Bukti Pembayaran"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <a
                href={selectedProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-semibold text-brand-terracotta hover:underline"
              >
                Buka gambar ukuran penuh ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
