import { getAllProducts } from "@/lib/notion";
import ProductManagement from "@/components/admin/ProductManagement";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-brand-brown">
          Manajemen Produk
        </h2>
        <p className="text-sm text-brand-gray mt-1">
          Tambah varian ukuran, ganti foto, ubah deskripsi, atur visibilitas,
          atau hapus produk. Perubahan tersimpan langsung ke Notion.
        </p>
      </div>
      <ProductManagement initialProducts={products} />
    </div>
  );
}
