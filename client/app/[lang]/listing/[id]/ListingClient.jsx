"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Loading from "@/app/components/Loading";
import {
  FaMapMarkerAlt as MapPin,
  FaPhone as Phone,
  FaEnvelope as Mail,
  FaGlobe as Globe,
  FaStar as Star,
  FaExternalLinkAlt as ExternalLink,
  FaChevronLeft as ChevronLeft,
  FaChevronRight as ChevronRight,
  FaHeart as Heart,
  FaShare as Share,
  FaCheck as Check,
  FaClock as Clock,
  FaCamera as Camera,
  FaShieldAlt as Shield,
  FaAward as Award,
  FaTimes as Times,
  FaExpand as Expand
} from "react-icons/fa";
import { getListingById } from "@/app/lib/https/listing.https";
import Link from "next/link";
import BookingModal from "@/app/components/BookingModal";
import { useUser } from "@/app/contexts/UserContext";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/app/lib/https/auth.https";
import Reviews from "@/app/components/Reviews";

// Custom date formatting function
const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months`;
  return `${Math.floor(diffInSeconds / 31536000)} years`;
};

export default function ListingDetailsPage() {
  const { id } = useParams();
  const { user } = useUser();
  const { language, t } = useLanguage();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      try {
        const data = await getListingById(id);
        setListing(data.data || data);
      } catch (e) {
        setListing(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchListing();
  }, [id]);

  const nextImage = () => {
    if (listing?.images?.length > 1) {
      setImgIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images?.length > 1) {
      setImgIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };


  useEffect(() => {
    if (!user?._id) return;
    getWishlist().then((items) => {
      setIsLiked(items.some(item => item._id === listing?._id));
    });
  }, [user?._id, listing?._id]);

  const handleWishlistToggle = async () => {
    if (!user?._id || !listing?._id) return;
    if (isLiked) {
      await removeFromWishlist(listing._id);
      setIsLiked(false);
    } else {
      await addToWishlist(listing._id);
      setIsLiked(true);
    }
  };

  if (loading) return <Loading />;

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#D61111', opacity: 0.1 }}>
            <ExternalLink className="w-10 h-10" style={{ color: '#D61111' }} />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
            {t("listing.notFound")}
          </h2>
          <p className="text-gray-600 mb-8" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
            {t("listing.notFoundDescription")}
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            style={{ backgroundColor: '#337914', fontFamily: "'Times New Roman Custom', serif" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const phone = listing.contact?.phone || listing.phone;
  const email = listing.contact?.email || listing.email;
  const website = listing.contact?.website || listing.website;
  const ctaUrl = listing.cta?.url;
  const ctaLabel = listing.cta?.label || t("listing.bookNow");

  return (
    <>
      <Head>
        <title>{listing.name?.[language] || t("listing.detailsTitle")} - Premium Booking Experience</title>
        <meta name="description" content={listing.description?.[language] || t("listing.noDescription")} />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        {/* Optimized Image Gallery Section */}
        <div className="relative bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Image Grid Layout */}
            <div className="grid grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
              {listing.images && listing.images.length > 0 ? (
                <>
                  {/* Main Large Image */}
                  <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${listing.images[0]}`}
                      alt={listing.name?.[language] || t("listing.imageAlt")}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                        <Expand className="w-6 h-6" style={{ color: '#337914' }} />
                      </div>
                    </div>
                  </div>

                  {/* Side Images */}
                  {listing.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative group cursor-pointer" onClick={() => { setImgIndex(idx + 1); setIsImageModalOpen(true); }}>
                      <Image
                        src={`http://localhost:5000/uploads/${img}`}
                        alt={`${listing.name?.[language]} - Image ${idx + 2}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                      {idx === 3 && listing.images.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Camera className="w-8 h-8 mx-auto mb-2" />
                            <span className="text-lg font-bold">+{listing.images.length - 5}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl">
                  <div className="text-center text-gray-400">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl" style={{ fontFamily: "'Times New Roman Custom', serif" }}>{t("listing.noImages") || "No images available"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Overlay Elements */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
              {/* Featured Badge */}
              {listing.isFeatured && (
                <div className="pointer-events-auto">
                  <div className="px-4 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm"
                    style={{ backgroundColor: '#D61111' }}>
                    <Star className="w-4 h-4" />
                    {t("listing.featured")}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pointer-events-auto">
                <button
                  onClick={handleWishlistToggle}
                  className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600 group-hover:text-red-500'}`} />
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-6">

              {/* Header Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4"
                      style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                      {listing.name?.[language] || t("listing.unnamed")}
                    </h1>

                    {listing.location?.city && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#337914' }}>
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                            {listing.location.city}
                          </p>
                          {listing.location.coordinates && (
                            <p className="text-sm text-gray-500">
                              {listing.location.coordinates.lat.toFixed(4)}, {listing.location.coordinates.lng.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {listing.subcategory?.name && (
                    <div className="flex-shrink-0">
                      <div className="px-6 py-3 rounded-xl text-white font-semibold text-lg shadow-lg"
                        style={{ backgroundColor: '#337914' }}>
                        {listing.subcategory.name[language] || listing.subcategory.name.en}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <Shield className="w-5 h-5" style={{ color: '#337914' }} />
                    <span className="text-sm font-medium" style={{ color: '#337914' }}>{t("listing.verified") || "Verified Listing"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{t("listing.premiumPartner") || "Premium Partner"}</span>
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                      {t("category.added")} {formatDistanceToNow(new Date(listing.createdAt))} {t("category.ago")}
                    </span>
                  </div>
                  {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                        {t("category.updated")} {formatDistanceToNow(new Date(listing.updatedAt))} {t("category.ago")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                  {t("listing.about") || "About This Experience"}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                    {listing.description?.[language] || t("listing.noDescription")}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                  {t("listing.getInTouch") || "Get In Touch"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="group flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: '#337914' }}>
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.callDirectly") || "Call Directly"}
                        </p>
                        <p className="font-bold text-lg" style={{ color: '#000000' }}>{phone}</p>
                      </div>
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.sendEmail") || "Send Email"}
                        </p>
                        <p className="font-bold text-lg" style={{ color: '#000000' }}>{email}</p>
                      </div>
                    </a>
                  )}

                  {website && (
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 md:col-span-2"
                    >
                      <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.visitWebsite")}
                        </p>
                        <p className="font-bold text-lg" style={{ color: '#000000' }}>{t("listing.visitWebsite")}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>


            {/* Right Column - Booking Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                  {/* Header */}
                  <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #337914 0%, #2d6b12 100%)' }}>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Tennyson BC', serif" }}>
                      {t("listing.bookYourExperience") || "Book Your Experience"}
                    </h3>
                    <p className="text-green-100" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                      {t("listing.secureReservation") || "Secure reservation in minutes"}
                    </p>
                  </div>

                  <div className="p-8">
                    {/* Premium Features */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#337914' }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.instantConfirmation") || "Instant Confirmation"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#337914' }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.customerSupport") || "24/7 Customer Support"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#337914' }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {t("listing.bestPriceGuarantee") || "Best Price Guarantee"}
                        </span>
                      </div>
                      {listing.isFeatured && (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D61111' }}>
                            <Star className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                            {t("listing.premiumFeatured") || "Premium Featured Listing"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main CTA */}
                    <div className="space-y-4">
                      {/* {ctaUrl ? (
                        <a
                          href={ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group w-full py-5 px-6 rounded-xl font-bold text-xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #337914 0%, #2d6b12 100%)', fontFamily: "'Tennyson BC', serif" }}
                        >
                          {ctaLabel}
                          <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </a>
                      ) : ( */}
                      <button
                        className="group w-full cursor-pointer py-5 px-6 rounded-xl font-bold text-xl text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #337914 0%, #2d6b12 100%)', fontFamily: "'Tennyson BC', serif" }}
                        onClick={() => setIsBookingOpen(true)}
                      >
                        {t("listing.bookNow")}
                        <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </button>
                      {/* )} */}
                      <BookingModal
                        open={isBookingOpen}
                        onClose={() => setIsBookingOpen(false)}
                        listingId={listing._id}
                      />

                      <p className="text-xs text-gray-500 text-center" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                        {t("listing.noCharges") || "No charges until confirmation"}
                      </p>
                    </div>

                    {/* Quick Contact */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-4 text-center font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                        {t("listing.needAssistance") || "Need immediate assistance?"}
                      </p>
                      <div className="flex gap-3">
                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-medium transition-all duration-300 hover:scale-105"
                            style={{ fontFamily: "'Times New Roman Custom', serif" }}
                          >
                            <Phone className="w-4 h-4" />
                            {t("listing.call") || "Call"}
                          </a>
                        )}
                        {email && (
                          <a
                            href={`mailto:${email}`}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-700 font-medium transition-all duration-300 hover:scale-105"
                            style={{ fontFamily: "'Times New Roman Custom', serif" }}
                          >
                            <Mail className="w-4 h-4" />
                            {t("listing.email") || "Email"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <Reviews listingId={listing._id} />


        {/* Enhanced Image Modal */}
        {isImageModalOpen && listing.images && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full w-full">
              {/* Close Button */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-16 right-0 text-white hover:text-gray-300 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
              >
                <Times className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image */}
              <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden">
                <Image
                  src={`http://localhost:5000/uploads/${listing.images[imgIndex]}`}
                  alt={listing.name?.[language] || t("listing.imageAlt")}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>

              {/* Image Counter */}
              <div className="flex justify-center mt-6 gap-2">
                {listing.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${imgIndex === idx
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/80'
                      }`}
                    onClick={() => setImgIndex(idx)}
                  />
                ))}
              </div>

              {/* Image Info */}
              <div className="text-center mt-4">
                <p className="text-white/80 text-sm" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                  {imgIndex + 1} of {listing.images.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}