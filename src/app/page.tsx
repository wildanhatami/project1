import { getProducts } from "@/lib/notion";
import HomeHero from "@/components/HomeHero";
import HomeGallery from "@/components/HomeGallery";
import HomeBanner from "@/components/HomeBanner";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col items-center w-full">
      <HomeHero />
      <HomeGallery products={products} />
      <HomeBanner />
    </div>
  );
}
