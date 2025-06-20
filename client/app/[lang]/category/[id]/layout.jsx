// app/category/[id]/layout.jsx

import { getCategoryWithListings } from '@/app/lib/https/cat.https';

export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const res = await getCategoryWithListings(id, 1);
    const category = res.category;
    const firstImage = res.listings?.[0]?.images?.[0];

    return {
      title: `${category?.name?.en} | Explore Listings`,
      description: `Discover top-rated ${category?.name?.en?.toLowerCase()} options available to book now.`,
      // ... rest of metadata config
    };
  } catch {
    return {
      title: 'Category | Explore Listings',
      description: 'Discover top-rated options available now.',
    };
  }
}

export default function CategoryLayout({ children }) {
  return (
    <div>
      {/* Common layout elements like header, nav, footer */}
      {children}
    </div>
  );
}
