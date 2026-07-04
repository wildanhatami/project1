import { Client } from '@notionhq/client';

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
  sizes: SizeOption[];
}

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

    const products: Product[] = response.results.map((page: any) => {
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
      
      const sizes: SizeOption[] = [];
      const price10 = properties.Price_10cm?.number;
      if (price10) sizes.push({ size: '10cm', price: price10 });
      
      const price14 = properties.Price_14cm?.number;
      if (price14) sizes.push({ size: '14cm', price: price14 });

      // Fallback if no sizes were provided
      if (sizes.length === 0) {
         sizes.push({ size: '10cm', price: 0 });
      }

      return {
        id: page.id,
        name,
        description,
        image,
        isBestseller,
        sizes,
      };
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products from Notion:", error);
    return [];
  }
}
