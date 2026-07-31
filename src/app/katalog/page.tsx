import { getProducts } from "@/lib/notion";
import CatalogGrid from "@/components/CatalogGrid";

// Revalidate every 60 seconds or whatever fits the use case (ISR)
export const revalidate = 60;

export default async function Katalog() {
  const products = await getProducts();

  return (
    <div className="flex flex-col items-center w-full pt-16 pb-24">
      {/* Header */}
      <div className="text-center mb-16 px-6 flex flex-col items-center gap-4 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-brown">Pilihan Menu It&apos;s Tasty</h1>
        <p className="text-brand-gray text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Product Grid (Client Component for interactive elements & animations) */}
      <CatalogGrid products={products} />
    </div>
  );
}
