import ListingDetailsPage from './ListingClient'; // your client component
import { getListingById } from '@/app/lib/https/listing.https';

export async function generateMetadata({ params }) {
  try {
    const listing = await getListingById(params.id);
    const data = listing.data || listing;

    return {
      title: `${data.name?.en || 'Listing Details'} - Premium Booking Experience`,
      description: data.description?.en || 'Discover this amazing experience and book now!',
      openGraph: {
        title: data.name?.en || 'Listing Details',
        description: data.description?.en || 'Discover this amazing experience and book now!',
        url: `https://yourdomain.com/listing/${params.id}`,
        images: data.images && data.images.length > 0
          ? [`https://yourdomain.com/uploads/${data.images[0]}`]
          : ['https://yourdomain.com/default-og-image.jpg'],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: data.name?.en || 'Listing Details',
        description: data.description?.en || 'Discover this amazing experience and book now!',
        images: data.images && data.images.length > 0
          ? [`https://yourdomain.com/uploads/${data.images[0]}`]
          : ['https://yourdomain.com/default-og-image.jpg'],
      },
      alternates: {
        canonical: `/listing/${params.id}`,
      },
    };
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return {
      title: 'Listing Details',
      description: 'Discover this amazing experience and book now!',
    };
  }
}

export default function ListingPageWrapper({ params }) {
  return <ListingDetailsPage id={params.id} />;
}
