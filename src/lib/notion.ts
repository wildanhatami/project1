import { Client } from '@notionhq/client';
import { errorMessage } from '@/lib/error';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export interface SizeOption {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  isBestseller: boolean;
  isActive: boolean;
  sizes: SizeOption[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPageToProduct(page: any): Product {
  const properties = page.properties;

  const name = properties.Name?.title?.[0]?.plain_text || 'Unknown Product';
  const description = (properties.Description || properties.deskripsi)?.rich_text?.[0]?.plain_text || '';

  let image = '';
  const imageFiles = properties.Image?.files || [];
  if (imageFiles.length > 0) {
    if (imageFiles[0].type === 'external') {
      image = imageFiles[0].external.url;
    } else if (imageFiles[0].type === 'file') {
      image = imageFiles[0].file.url;
    }
  }

  const isBestseller = properties.IsBestseller?.checkbox || false;
  const isActive = properties.IsActive?.checkbox ?? true;

  const sizes: SizeOption[] = [];

  // Prioritas utama: properti "Sizes" (rich_text berisi JSON array)
  // {"size":"10cm","price":35000} — fleksibel untuk menambah varian ukuran baru.
  const sizesJson = properties.Sizes?.rich_text?.[0]?.plain_text;
  if (sizesJson) {
    try {
      const parsed = JSON.parse(sizesJson);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && typeof item.size === 'string' && typeof item.price === 'number') {
            sizes.push({ size: item.size, price: item.price });
          }
        }
      }
    } catch (error) {
      console.error(`[notion] Gagal parse properti Sizes untuk "${name}":`, error);
    }
  }

  // Fallback backward-compatible: properti number Price_10cm / Price_14cm
  if (sizes.length === 0) {
    const price10 = properties.Price_10cm?.number;
    if (price10) sizes.push({ size: '10cm', price: price10 });

    const price14 = properties.Price_14cm?.number;
    if (price14) sizes.push({ size: '14cm', price: price14 });
  }

  // Fallback jika belum ada ukuran sama sekali
  if (sizes.length === 0) {
    sizes.push({ size: '10cm', price: 0 });
  }

  return {
    id: page.id,
    name,
    description,
    image,
    isBestseller,
    isActive,
    sizes,
  };
}

/**
 * Ambil produk yang aktif (tampil di katalog publik).
 */
export async function getProducts(): Promise<Product[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.error("NOTION_DATABASE_ID is not defined.");
    return [];
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: {
        property: 'IsActive',
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results.map(mapPageToProduct);
  } catch (error) {
    console.error("Failed to fetch products from Notion:", error);
    return [];
  }
}

/**
 * Ambil SEMUA produk (termasuk yang tidak aktif) — untuk dashboard admin.
 */
export async function getAllProducts(): Promise<Product[]> {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return [];

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    });

    return response.results.map(mapPageToProduct);
  } catch (error) {
    console.error("[notion] getAllProducts error:", error);
    return [];
  }
}

export interface UpdateProductInput {
  description?: string;
  isActive?: boolean;
  isBestseller?: boolean;
  sizes?: SizeOption[];
}

/**
 * Perbarui properti produk: deskripsi, visibilitas (IsActive), bestseller,
 * dan varian ukuran (properti "Sizes" — JSON, plus kolom Price_10cm/14cm lama).
 */
export async function updateProduct(
  pageId: string,
  data: UpdateProductInput
): Promise<{ ok: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {};

    if (data.description !== undefined) {
      properties.deskripsi = {
        rich_text: data.description
          ? [{ text: { content: data.description } }]
          : [],
      };
    }

    if (data.isActive !== undefined) {
      properties.IsActive = { checkbox: data.isActive };
    }

    if (data.isBestseller !== undefined) {
      properties.IsBestseller = { checkbox: data.isBestseller };
    }

    if (data.sizes !== undefined) {
      const sizes = data.sizes
        .filter((s) => s.size.trim() && !isNaN(s.price))
        .map((s) => ({ size: s.size.trim(), price: Number(s.price) }));

      properties.Sizes = {
        rich_text: [{ text: { content: JSON.stringify(sizes) } }],
      };

      // Sinkronkan kolom lama agar kompatibel dengan pengeditan manual di Notion
      const price10 = sizes.find((s) => s.size === '10cm')?.price;
      const price14 = sizes.find((s) => s.size === '14cm')?.price;
      properties.Price_10cm = { number: price10 ?? null };
      properties.Price_14cm = { number: price14 ?? null };
    }

    await notion.pages.update({
      page_id: pageId,
      properties,
    });

    return { ok: true };
  } catch (error) {
    console.error("[notion] updateProduct error:", error);
    return { ok: false, error: errorMessage(error, "Gagal memperbarui produk") };
  }
}

/**
 * Unggah foto produk baru ke Notion lalu pasang ke properti Image.
 * Batas file tunggal Notion: 20MB (mode single_part).
 */
export async function uploadProductImage(
  pageId: string,
  file: { name: string; type: string; data: Blob }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const upload = await notion.fileUploads.create({
      mode: 'single_part',
      filename: file.name,
      content_type: file.type,
    });

    await notion.fileUploads.send({
      file_upload_id: upload.id,
      file: {
        filename: file.name,
        data: file.data,
      },
    });

    await notion.pages.update({
      page_id: pageId,
      properties: {
        Image: {
          files: [
            {
              type: 'file_upload',
              file_upload: { id: upload.id },
              name: file.name,
            },
          ],
        },
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("[notion] uploadProductImage error:", error);
    return { ok: false, error: errorMessage(error, "Gagal mengunggah foto") };
  }
}

function mapPageToTestimonial(page: any): Testimonial {
  const properties = page.properties;

  const name = properties.Name?.title?.[0]?.plain_text || "Anonymous";
  const review = properties.Review?.rich_text?.[0]?.plain_text || "";
  const rating = properties.Rating?.number ?? 5;

  let avatar = "";
  const avatarFiles = properties.Avatar?.files || [];
  if (avatarFiles.length > 0) {
    if (avatarFiles[0].type === "external") {
      avatar = avatarFiles[0].external.url;
    } else if (avatarFiles[0].type === "file") {
      avatar = avatarFiles[0].file.url;
    }
  }

  return {
    id: page.id,
    name,
    avatar,
    rating: Math.min(5, Math.max(1, rating)),
    text: review,
    product: properties.Product?.rich_text?.[0]?.plain_text || "",
  };
}

/**
 * Hapus produk dari katalog dengan mengarsipkan halaman di Notion.
 */
export async function deleteProduct(
  pageId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    return { ok: true };
  } catch (error) {
    console.error("[notion] deleteProduct error:", error);
    return { ok: false, error: errorMessage(error, "Gagal menghapus produk") };
  }
}

/**
 * Ambil testimoni aktif dari database Notion.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const databaseId = process.env.NOTION_TESTIMONIALS_DATABASE_ID;
  if (!databaseId) {
    console.error("NOTION_TESTIMONIALS_DATABASE_ID is not defined.");
    return [];
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: {
        property: "IsActive",
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results.map(mapPageToTestimonial);
  } catch (error) {
    console.error("Failed to fetch testimonials from Notion:", error);
    return [];
  }
}

/**
 * Hapus testimoni dari database dengan mengarsipkan halaman di Notion.
 */
export async function deleteTestimonial(
  pageId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    return { ok: true };
  } catch (error) {
    console.error("[notion] deleteTestimonial error:", error);
    return { ok: false, error: errorMessage(error, "Gagal menghapus testimoni") };
  }
}

export interface CreateProductInput {
  name: string;
  description?: string;
  isActive?: boolean;
  isBestseller?: boolean;
  sizes?: SizeOption[];
  image?: File;
}

/**
 * Buat produk baru di database Notion.
 */
export async function createProduct(
  data: CreateProductInput
): Promise<{ ok: boolean; error?: string; id?: string }> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      return { ok: false, error: "NOTION_DATABASE_ID tidak dikonfigurasi" };
    }

    const sizes = data.sizes
      ?.filter((s) => s.size.trim() && !isNaN(s.price))
      .map((s) => ({ size: s.size.trim(), price: Number(s.price) })) ?? [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties: Record<string, any> = {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      IsActive: { checkbox: data.isActive ?? true },
      IsBestseller: { checkbox: data.isBestseller ?? false },
    };

    if (data.description) {
      properties.deskripsi = {
        rich_text: [{ text: { content: data.description } }],
      };
    }

    if (sizes.length > 0) {
      properties.Sizes = {
        rich_text: [{ text: { content: JSON.stringify(sizes) } }],
      };

      const price10 = sizes.find((s) => s.size === "10cm")?.price;
      const price14 = sizes.find((s) => s.size === "14cm")?.price;
      properties.Price_10cm = { number: price10 ?? null };
      properties.Price_14cm = { number: price14 ?? null };
    }

    const response = await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: databaseId },
      properties,
    });

    // Jika ada gambar, upload langsung ke halaman yang baru dibuat
    if (data.image && response.id) {
      const uploadRes = await uploadProductImage(response.id, {
        name: data.image.name,
        type: data.image.type,
        data: data.image,
      });
      if (!uploadRes.ok) {
        console.warn("[notion] createProduct: gagal upload gambar:", uploadRes.error);
      }
    }

    return { ok: true, id: response.id };
  } catch (error) {
    console.error("[notion] createProduct error:", error);
    return { ok: false, error: errorMessage(error, "Gagal membuat produk") };
  }
}

export type OrderStatus = "Pending" | "Verified" | "Completed" | "Cancelled";

export interface OrderItemInput {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItemInput[];
  totalAmount: number;
  status: OrderStatus;
  paymentProofUrl: string;
  orderMethod: string;
  paymentMethod: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPageToOrder(page: any): Order {
  const props = page.properties;

  const customerName = props.CustomerName?.title?.[0]?.plain_text || "Pelanggan";
  const customerEmail = props.CustomerEmail?.email || "";
  const totalAmount = props.TotalAmount?.number || 0;
  const status = (props.Status?.select?.name as OrderStatus) || "Pending";
  const orderMethod = props.OrderMethod?.rich_text?.[0]?.plain_text || "";
  const paymentMethod = props.PaymentMethod?.rich_text?.[0]?.plain_text || "";
  const createdAt = props.CreatedAt?.date?.start || page.created_time || "";

  let paymentProofUrl = "";
  const proofFiles = props.PaymentProof?.files || [];
  if (proofFiles.length > 0) {
    if (proofFiles[0].type === "external") {
      paymentProofUrl = proofFiles[0].external.url;
    } else if (proofFiles[0].type === "file") {
      paymentProofUrl = proofFiles[0].file.url;
    }
  }

  let items: OrderItemInput[] = [];
  const itemsJson = props.Items?.rich_text?.[0]?.plain_text;
  if (itemsJson) {
    try {
      items = JSON.parse(itemsJson);
    } catch {
      // ignore
    }
  }

  return {
    id: page.id,
    customerName,
    customerEmail,
    items,
    totalAmount,
    status,
    paymentProofUrl,
    orderMethod,
    paymentMethod,
    createdAt,
  };
}

/**
 * Ambil SEMUA pesanan dari Notion Orders Database.
 */
export async function getOrders(): Promise<Order[]> {
  const databaseId = process.env.NOTION_ORDERS_DATABASE_ID;
  if (!databaseId) return [];

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
    });

    return response.results.map(mapPageToOrder);
  } catch (error) {
    console.error("[notion] getOrders error:", error);
    return [];
  }
}

/**
 * Update status pesanan di Notion.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    await notion.pages.update({
      page_id: orderId,
      properties: {
        Status: {
          select: { name: status },
        },
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("[notion] updateOrderStatus error:", error);
    return { ok: false, error: errorMessage(error, "Gagal mengupdate status pesanan") };
  }
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  items: OrderItemInput[];
  totalAmount: number;
  orderMethod: string;
  paymentMethod: string;
  paymentProof?: File;
}

/**
 * Buat pesanan baru & upload foto bukti bayar di Notion Orders Database.
 */
export async function createOrder(
  data: CreateOrderInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const databaseId = process.env.NOTION_ORDERS_DATABASE_ID;
    if (!databaseId) {
      return { ok: false, error: "NOTION_ORDERS_DATABASE_ID tidak dikonfigurasi" };
    }

    const response = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: databaseId },
      properties: {
        CustomerName: {
          title: [{ text: { content: data.customerName } }],
        },
        CustomerEmail: {
          email: data.customerEmail || null,
        },
        Items: {
          rich_text: [{ text: { content: JSON.stringify(data.items) } }],
        },
        TotalAmount: {
          number: data.totalAmount,
        },
        Status: {
          select: { name: "Pending" },
        },
        OrderMethod: {
          rich_text: [{ text: { content: data.orderMethod } }],
        },
        PaymentMethod: {
          rich_text: [{ text: { content: data.paymentMethod } }],
        },
        CreatedAt: {
          date: { start: new Date().toISOString() },
        },
      },
    });

    if (data.paymentProof && response.id) {
      await uploadOrderPaymentProof(response.id, {
        name: data.paymentProof.name,
        type: data.paymentProof.type,
        data: data.paymentProof,
      });
    }

    return { ok: true, id: response.id };
  } catch (error) {
    console.error("[notion] createOrder error:", error);
    return { ok: false, error: errorMessage(error, "Gagal membuat pesanan") };
  }
}

/**
 * Unggah bukti pembayaran ke properti PaymentProof di Notion page order.
 */
export async function uploadOrderPaymentProof(
  orderId: string,
  file: { name: string; type: string; data: Blob }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const upload = await notion.fileUploads.create({
      mode: "single_part",
      filename: file.name,
      content_type: file.type,
    });

    await notion.fileUploads.send({
      file_upload_id: upload.id,
      file: {
        filename: file.name,
        data: file.data,
      },
    });

    await notion.pages.update({
      page_id: orderId,
      properties: {
        PaymentProof: {
          files: [
            {
              type: "file_upload",
              file_upload: { id: upload.id },
              name: file.name,
            },
          ],
        },
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("[notion] uploadOrderPaymentProof error:", error);
    return { ok: false, error: errorMessage(error, "Gagal mengunggah bukti bayar") };
  }
}
