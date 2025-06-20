// app/page.tsx

import AddToHomeScreen from "../components/AddToHomeScreen";
import AboutUsSection from "../components/home/sections/AboutUsSection";
import CategoriesSection from "../components/home/sections/CategoriesSection";
import ContactFormSection from "../components/home/sections/ContactFormSection";
import Footer from "../components/home/sections/Footer";
import IntroSection from "../components/home/sections/IntroSection";
import MapSection from "../components/home/sections/MapSection";
import PartnersSection from "../components/home/sections/PartnersSection";
import PromotionSection from "../components/home/sections/PromotionSection";
import TeamSection from "../components/home/sections/TeamSection";
import TestimonialsSection from "../components/home/sections/TestimonialsSection";

// ✅ SEO Metadata
export const metadata = {
  title: "SyrianaGo | رحلتك السوريّة تبدأ من هنا",
  description:
    "Explore Syria with SyrianaGo – Your one-stop platform for booking hotels, tours, health services, restaurants, and more. Secure payments, local support, and rich cultural experiences.",
  keywords: [
    "Syria tourism",
    "SyrianaGo",
    "book Syria trip",
    "Syria hotels",
    "Damascus travel",
    "Syria cultural tours",
    "visit Syria",
    "Middle East travel",
    "سياحة سوريا",
    "حجز سوريا"
  ],
  openGraph: {
    title: "SyrianaGo – رحلتك السوريّة تبدأ من هنا",
    description:
      "Plan and book your trip to Syria with confidence. From accommodations to health tourism and cultural events – all in one place.",
    url: "https://syrianago.com",
    siteName: "SyrianaGo",
    images: [
      {
        url: "/images/og-hero.jpg", // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: "SyrianaGo - Discover Syria",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SyrianaGo | رحلتك السوريّة تبدأ من هنا",
    description:
      "Your gateway to Syria’s rich heritage, tourism, and hospitality. Browse, book, and explore with SyrianaGo.",
    images: ["/images/og-hero.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function HomePage() {
  return (
    <>
      <IntroSection />
      <CategoriesSection />
      <AboutUsSection />
      <PromotionSection />
      <TestimonialsSection />
      <PartnersSection />
      <TeamSection />
      <ContactFormSection />
      <MapSection />
      <AddToHomeScreen />
      <Footer />
    </>
  );
}
