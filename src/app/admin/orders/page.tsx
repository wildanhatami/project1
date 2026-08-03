import OrderManagement from "@/components/admin/OrderManagement";
import { getOrders } from "@/lib/notion";

export const revalidate = 0; // Dynamic fetching

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-brand-brown">
          Kelola Pesanan
        </h2>
        <p className="text-sm text-brand-gray mt-1">
          Lihat rincian pesanan masuk, verifikasi bukti pembayaran, dan perbarui status.
        </p>
      </div>
      <OrderManagement initialOrders={orders} />
    </div>
  );
}
