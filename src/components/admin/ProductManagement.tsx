"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Star,
  Pencil,
  Trash2,
  Upload,
  Plus,
  X,
  Loader2,
  Check,
} from "lucide-react";
import type { Product, SizeOption } from "@/lib/notion";
import Image from "next/image";

interface EditDraft {
  id: string;
  name: string;
  description: string;
  sizes: SizeOption[];
  isActive: boolean;
  isBestseller: boolean;
}

interface CreateDraft {
  name: string;
  description: string;
  sizes: SizeOption[];
  isActive: boolean;
  isBestseller: boolean;
  image: File | null;
  imagePreview: string | null;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Terjadi kesalahan");
  }
  return data;
}

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function ProductManagement({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<EditDraft | null>(null);
  const [creating, setCreating] = useState<CreateDraft | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = useCallback((type: "ok" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const openEdit = (product: Product) => {
    setEditing({
      id: product.id,
      name: product.name,
      description: product.description,
      sizes: product.sizes.map((s) => ({ ...s })),
      isActive: product.isActive,
      isBestseller: product.isBestseller,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      await api(`/api/admin/products/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editing.description,
          isActive: editing.isActive,
          isBestseller: editing.isBestseller,
          sizes: editing.sizes,
        }),
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                description: editing.description,
                sizes: editing.sizes.filter((s) => s.size.trim() && !isNaN(s.price)),
                isActive: editing.isActive,
                isBestseller: editing.isBestseller,
              }
            : p
        )
      );
      setEditing(null);
      showMessage("ok", "Produk berhasil diperbarui.");
    } catch (error) {
      showMessage("error", errorText(error, "Gagal memperbarui produk"));
    } finally {
      setBusy(false);
    }
  };

  const openCreate = () => {
    setCreating({
      name: "",
      description: "",
      sizes: [{ size: "", price: 0 }],
      isActive: true,
      isBestseller: false,
      image: null,
      imagePreview: null,
    });
  };

  const saveCreate = async () => {
    if (!creating) return;
    if (!creating.name.trim()) {
      showMessage("error", "Nama produk wajib diisi");
      return;
    }
    const validSizes = creating.sizes.filter((s) => s.size.trim() && !isNaN(s.price));
    if (validSizes.length === 0) {
      showMessage("error", "Minimal satu varian ukuran wajib diisi");
      return;
    }
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("name", creating.name.trim());
      if (creating.description.trim()) {
        formData.append("description", creating.description.trim());
      }
      formData.append("isActive", String(creating.isActive));
      formData.append("isBestseller", String(creating.isBestseller));
      formData.append("sizes", JSON.stringify(validSizes));
      if (creating.image) {
        formData.append("image", creating.image);
      }

      await api("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      // Segarkan daftar produk
      const data = await api<{ products: Product[] }>("/api/admin/products");
      setProducts(data.products);

      setCreating(null);
      showMessage("ok", "Produk baru berhasil ditambahkan.");
    } catch (error) {
      showMessage("error", errorText(error, "Gagal menambahkan produk"));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && creating) {
      const preview = URL.createObjectURL(file);
      setCreating({ ...creating, image: file, imagePreview: preview });
    }
    e.target.value = "";
  };

  const handleToggleActive = async (product: Product) => {
    setBusy(true);
    try {
      const next = !product.isActive;
      await api(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: next } : p))
      );
      showMessage(
        "ok",
        next
          ? `"${product.name}" ditampilkan di katalog.`
          : `"${product.name}" disembunyikan dari katalog.`
      );
    } catch (error) {
      showMessage("error", errorText(error, "Gagal mengubah visibilitas"));
    } finally {
      setBusy(false);
    }
  };

  const handleUploadImage = async (product: Product, file: File) => {
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api(`/api/admin/products/${product.id}/image`, {
        method: "POST",
        body: formData,
      });
      // Segarkan gambar dari server (URL Notion bisa berubah/expired)
      const data = await api<{ products: Product[] }>("/api/admin/products");
      setProducts(data.products);
      setEditing((prev) =>
        prev && prev.id === product.id
          ? {
              ...prev,
              sizes: data.products.find((p) => p.id === product.id)?.sizes ?? prev.sizes,
            }
          : prev
      );
      showMessage("ok", `Foto "${product.name}" berhasil diperbarui.`);
    } catch (error) {
      showMessage("error", errorText(error, "Gagal mengunggah foto"));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/api/admin/products/${deleting.id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
      setDeleting(null);
      showMessage("ok", `"${deleting.name}" dihapus dari katalog.`);
    } catch (error) {
      showMessage("error", errorText(error, "Gagal menghapus produk"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`mb-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
            message.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "ok" ? <Check size={16} /> : <X size={16} />}
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg font-semibold text-brand-brown">
            Daftar Produk ({products.length})
          </h3>
        </div>
        <button
          onClick={openCreate}
          disabled={busy}
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-terracotta hover:bg-brand-terracotta-hover transition-colors disabled:opacity-50 px-4 py-2 rounded-lg"
        >
          <Plus size={15} />
          Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-brown/8 p-10 text-center text-brand-gray">
          Belum ada produk di database Notion.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-brand-brown/8 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Foto */}
              <div className="relative shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover bg-brand-brown/5"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-brand-brown/5 flex items-center justify-center text-brand-gray text-xs">
                    No Image
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-terracotta text-white flex items-center justify-center shadow-md hover:bg-brand-terracotta-hover transition-colors"
                  title="Unggah foto baru"
                >
                  <Upload size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadImage(product, file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-brand-brown truncate">
                    {product.name}
                  </h3>
                  {product.isBestseller && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-terracotta bg-brand-light-cream px-2 py-0.5 rounded-full">
                      <Star size={10} />
                      Terlaris
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      product.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-brand-brown/5 text-brand-gray"
                    }`}
                  >
                    {product.isActive ? "Aktif" : "Tersembunyi"}
                  </span>
                </div>
                <p className="text-sm text-brand-gray mt-1 line-clamp-2">
                  {product.description || "Belum ada deskripsi."}
                </p>
                <p className="text-xs text-brand-gray/70 mt-1.5 flex flex-wrap gap-x-3">
                  {product.sizes.map((s) => (
                    <span key={s.size}>
                      {s.size}:{" "}
                      <span className="font-semibold text-brand-brown">
                        Rp {s.price.toLocaleString("id-ID")}
                      </span>
                    </span>
                  ))}
                </p>
              </div>

              {/* Aksi */}
              <div className="flex md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => openEdit(product)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-brown bg-brand-light-cream hover:bg-brand-brown/10 px-4 py-2 rounded-lg transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(product)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors bg-brand-light-cream hover:bg-brand-brown/10 text-brand-brown"
                  title={product.isActive ? "Sembunyikan" : "Tampilkan"}
                >
                  {product.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  {product.isActive ? "Sembunyikan" : "Tampilkan"}
                </button>
                <button
                  onClick={() => setDeleting(product)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit */}
      <AnimatePresence>
        {editing && (
          <ModalShell onClose={() => setEditing(null)} title={`Edit: ${editing.name}`}>
            <div className="space-y-5">
              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Deskripsi Produk
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                  placeholder="Deskripsi produk..."
                />
              </div>

              {/* Varian Ukuran */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Varian Ukuran & Harga
                </label>
                <div className="space-y-2">
                  {editing.sizes.map((sizeOpt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={sizeOpt.size}
                        onChange={(e) => {
                          const sizes = [...editing.sizes];
                          sizes[idx] = { ...sizes[idx], size: e.target.value };
                          setEditing({ ...editing, sizes });
                        }}
                        placeholder="Ukuran (cth: 12cm)"
                        className="w-1/2 rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                      />
                      <input
                        type="number"
                        min={0}
                        value={sizeOpt.price}
                        onChange={(e) => {
                          const sizes = [...editing.sizes];
                          sizes[idx] = {
                            ...sizes[idx],
                            price: Number(e.target.value),
                          };
                          setEditing({ ...editing, sizes });
                        }}
                        placeholder="Harga (Rp)"
                        className="flex-1 rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                      />
                      <button
                        onClick={() => {
                          const sizes = editing.sizes.filter((_, i) => i !== idx);
                          setEditing({ ...editing, sizes });
                        }}
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                        title="Hapus ukuran"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setEditing({
                      ...editing,
                      sizes: [...editing.sizes, { size: "", price: 0 }],
                    })
                  }
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-terracotta hover:text-brand-terracotta-hover transition-colors"
                >
                  <Plus size={15} />
                  Tambah varian ukuran
                </button>
              </div>

              {/* Toggle */}
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm font-semibold text-brand-brown">
                    Tampilkan di katalog
                  </span>
                  <Switch
                    checked={editing.isActive}
                    onChange={(v) => setEditing({ ...editing, isActive: v })}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm font-semibold text-brand-brown">
                    Tandai sebagai Terlaris (Bestseller)
                  </span>
                  <Switch
                    checked={editing.isBestseller}
                    onChange={(v) => setEditing({ ...editing, isBestseller: v })}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-brand-gray bg-brand-light-cream hover:bg-brand-brown/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={saveEdit}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-brand-terracotta hover:bg-brand-terracotta-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy && <Loader2 size={15} className="animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Modal Tambah Produk */}
      <AnimatePresence>
        {creating && (
          <ModalShell onClose={() => setCreating(null)} title="Tambah Produk Baru">
            <div className="space-y-5">
              {/* Foto Produk */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Foto Produk
                </label>
                <button
                  type="button"
                  onClick={() => createFileInputRef.current?.click()}
                  className="w-full"
                >
                  {creating.imagePreview ? (
                    <div className="relative aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-brand-brown/5">
                      <Image
                        src={creating.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCreating({ ...creating, image: null, imagePreview: null })
                        }
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative aspect-square max-w-xs mx-auto rounded-xl border-2 border-dashed border-brand-brown/20 bg-brand-cream flex flex-col items-center justify-center gap-2 p-6 text-center hover:border-brand-terracotta/50 transition-colors"
                    >
                      <Upload size={28} className="text-brand-brown/50" />
                      <span className="text-sm font-medium text-brand-brown">Klik untuk pilih foto</span>
                      <span className="text-xs text-brand-gray">JPG, PNG, WebP, GIF (max 20MB)</span>
                    </div>
                  )}
                </button>
                <input
                  ref={createFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleCreateImageChange}
                />
              </div>

              {/* Nama Produk */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  value={creating.name}
                  onChange={(e) => setCreating({ ...creating, name: e.target.value })}
                  placeholder="Contoh: Brownies Classic"
                  className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                  maxLength={100}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Deskripsi Produk
                </label>
                <textarea
                  value={creating.description}
                  onChange={(e) => setCreating({ ...creating, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                  placeholder="Deskripsi produk..."
                />
              </div>

              {/* Varian Ukuran */}
              <div>
                <label className="block text-sm font-semibold text-brand-brown mb-1.5">
                  Varian Ukuran & Harga <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {creating.sizes.map((sizeOpt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={sizeOpt.size}
                        onChange={(e) => {
                          const sizes = [...creating.sizes];
                          sizes[idx] = { ...sizes[idx], size: e.target.value };
                          setCreating({ ...creating, sizes });
                        }}
                        placeholder="Ukuran (cth: 12cm)"
                        className="w-1/2 rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                      />
                      <input
                        type="number"
                        min={0}
                        value={sizeOpt.price}
                        onChange={(e) => {
                          const sizes = [...creating.sizes];
                          sizes[idx] = {
                            ...sizes[idx],
                            price: Number(e.target.value),
                          };
                          setCreating({ ...creating, sizes });
                        }}
                        placeholder="Harga (Rp)"
                        className="flex-1 rounded-xl border border-brand-brown/15 bg-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
                      />
                      <button
                        onClick={() => {
                          const sizes = creating.sizes.filter((_, i) => i !== idx);
                          setCreating({ ...creating, sizes });
                        }}
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                        title="Hapus ukuran"
                        disabled={creating.sizes.length === 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCreating({
                      ...creating,
                      sizes: [...creating.sizes, { size: "", price: 0 }],
                    })
                  }
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-terracotta hover:text-brand-terracotta-hover transition-colors"
                >
                  <Plus size={15} />
                  Tambah varian ukuran
                </button>
              </div>

              {/* Toggle */}
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm font-semibold text-brand-brown">
                    Tampilkan di katalog
                  </span>
                  <Switch
                    checked={creating.isActive}
                    onChange={(v) => setCreating({ ...creating, isActive: v })}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span className="text-sm font-semibold text-brand-brown">
                    Tandai sebagai Terlaris (Bestseller)
                  </span>
                  <Switch
                    checked={creating.isBestseller}
                    onChange={(v) => setCreating({ ...creating, isBestseller: v })}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCreating(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-brand-gray bg-brand-light-cream hover:bg-brand-brown/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={saveCreate}
                  disabled={busy}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-brand-terracotta hover:bg-brand-terracotta-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy && <Loader2 size={15} className="animate-spin" />}
                  Simpan Produk
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {deleting && (
          <ModalShell onClose={() => setDeleting(null)} title="Hapus Produk?">
            <p className="text-sm text-brand-gray leading-relaxed">
              Produk{" "}
              <span className="font-semibold text-brand-brown">
                &quot;{deleting.name}&quot;
              </span>{" "}
              akan dihapus dari katalog dan tidak bisa ditampilkan lagi
              (halaman diarsipkan di Notion).
            </p>
            <div className="flex gap-3 pt-5">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-brand-gray bg-brand-light-cream hover:bg-brand-brown/10 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={busy}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy && <Loader2 size={15} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalShell({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
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
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl p-4 md:p-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:pb-6 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl font-bold text-brand-brown">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-brand-light-cream text-brand-gray flex items-center justify-center hover:bg-brand-brown/10 transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        checked ? "bg-brand-terracotta" : "bg-brand-brown/15"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
