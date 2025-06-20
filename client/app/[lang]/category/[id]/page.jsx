import CategoryClient from './CategoryClientPage';
import { getCategoryWithListings } from '@/app/lib/https/cat.https';

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const res = await getCategoryWithListings(id, 1);
    const category = res.category;
    const firstImage = res.listings?.[0]?.images?.[0];

    return {
      title: `${category?.name?.en} | Explore Listings & Book Now`,
      description: `Discover top-rated ${category?.name?.en?.toLowerCase()} options available now. Verified listings with direct booking, contact info, and more.`,
      openGraph: {
        title: `${category?.name?.en} | Explore Listings`,
        description: `Book from a variety of trusted ${category?.name?.en?.toLowerCase()} listings with full details and contact options.`,
        type: 'website',
        url: `https://SyrianaGo.com/category/${id}`,
        images: firstImage
          ? [`https://SyrianaGo.com/uploads/${firstImage}`]
          : [`https://SyrianaGo.com/default-og-image.jpg`],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category?.name?.en} | Explore Listings`,
        description: `Browse ${category?.name?.en?.toLowerCase()} listings, find the best match, and book instantly.`,
        images: firstImage
          ? [`https://SyrianaGo.com/uploads/${firstImage}`]
          : [`https://SyrianaGo.com/default-og-image.jpg`],
      },
      alternates: {
        canonical: `/category/${id}`,
      },
    };
  } catch (error) {
    console.error('Metadata error:', error);
    return {
      title: 'Category | Explore Listings',
      description: 'Discover top-rated options available now.',
    };
  }
}

export default function CategoryPage({ params }) {
  return <CategoryClient categoryId={params.id} />;
}
