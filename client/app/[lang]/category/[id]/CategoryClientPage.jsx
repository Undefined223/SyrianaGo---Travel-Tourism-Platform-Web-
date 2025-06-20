"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Head from "next/head";
import { getCategoryWithListings } from "@/app/lib/https/cat.https";
import Skeleton from "@/app/components/Skeleton";
import { Phone, Mail, Globe, MapPin, Star, Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";


export default function CategoryPage() {
    const { id } = useParams();
    const { language, t, isLoading: langLoading } = useLanguage();
    const router = useRouter();
    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchListings() {
            try {
                setLoading(true);
                const res = await getCategoryWithListings(id, currentPage);
                console.log(res)
                setCategory(res.category);
                setSubcategories(res.subcategories || []);
                setListings(res.listings);
                setFilteredListings(res.listings);
                setTotalPages(res.totalPages);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchListings();
    }, [id, currentPage]);

    const handleFilter = (subcategory) => {
        console.log('test', subcategory)
        const filtered = listings.filter((item) => item.subcategory === subcategory);
        setFilteredListings(filtered);
        setActiveSubcategory(subcategory);
    };

    const clearFilter = () => {
        setFilteredListings(listings);
        setActiveSubcategory(null);
    };

    const handleBooking = (listing) => {
        if (listing.booking) {
            window.open(listing.booking, '_blank');
        }
    };

    const handleContact = (type, value) => {
        if (type === 'phone') {
            window.open(`tel:${value}`);
        } else if (type === 'email') {
            window.open(`mailto:${value}`);
        } else if (type === 'website') {
            window.open(value, '_blank');
        }
    };

    const uniqueSubcategories = Array.from(new Set(listings.map((item) => item.subcategory)));

    if (loading) {
        return (
            <>
                <Head>
                    <title>{category?.name?.en} | Explore Listings & Book Now</title>
                    <meta
                        name="description"
                        content={`Discover top-rated ${category?.name?.en?.toLowerCase()} options available now. Verified listings with direct booking, contact info, and more.`}
                    />
                    <meta property="og:title" content={`${category?.name?.en} | Explore Listings`} />
                    <meta
                        property="og:description"
                        content={`Book from a variety of trusted ${category?.name?.en?.toLowerCase()} listings with full details and contact options.`}
                    />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={`https://yourdomain.com/category/${id}`} />
                    <meta
                        property="og:image"
                        content={
                            filteredListings?.[0]?.images?.[0]
                                ? `https://yourdomain.com/uploads/${filteredListings[0].images[0]}`
                                : 'https://yourdomain.com/default-og-image.jpg'
                        }
                    />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${category?.name?.en} | Explore Listings`} />
                    <meta
                        name="twitter:description"
                        content={`Browse ${category?.name?.en?.toLowerCase()} listings, find the best match, and book instantly.`}
                    />
                    <meta
                        name="twitter:image"
                        content={
                            filteredListings?.[0]?.images?.[0]
                                ? `https://yourdomain.com/uploads/${filteredListings[0].images[0]}`
                                : 'https://yourdomain.com/default-og-image.jpg'
                        }
                    />
                    <link rel="canonical" href={`https://yourdomain.com/category/${id}`} />
                </Head>


            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`${category?.name[language]} - Category Listings`}</title>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#337914] to-green-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <h1 className="text-5xl font-bold mb-4">
                            {category?.name[language] || t('category.listingsTitle')}
                        </h1>
                        <p className="text-xl text-green-100 max-w-2xl">
                            {t('category.heroDescription', { category: category?.name[language]?.toLowerCase() || t('category.options') })}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-green-100">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{filteredListings.length} {t('category.availableOptions')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span>{t('category.verifiedListings')}</span>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <span>{t('category.page')} {currentPage} {t('category.of')} {totalPages}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Filter Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('category.filterByCategory')}</h2>
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400">
                            <button
                                onClick={clearFilter}
                                className={`px-6 py-3 rounded-full border-2 font-semibold transition-all whitespace-nowrap ${!activeSubcategory
                                    ? "bg-[#337914] text-white border-[#337914] shadow-lg transform scale-105"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-[#337914] hover:text-[#337914]"
                                    }`}
                            >
                                {t('category.all')} ({listings.length})
                            </button>
                            {subcategories.map((subcategory) => {
                                const count = listings.filter(
                                    (listing) => listing.subcategory === subcategory._id
                                ).length;

                                return (
                                    <button
                                        key={subcategory._id}
                                        className={`px-3 py-1 rounded-full border ${activeSubcategory === subcategory._id
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-black'
                                            }`}
                                        onClick={() => handleFilter(subcategory._id)}
                                    >
                                        {subcategory?.name?.[language] ?? subcategory?.name?.en} ({count})
                                    </button>
                                );
                            })}
                            {activeSubcategory && (
                                <button
                                    onClick={clearFilter}
                                    className="px-6 py-3 rounded-full border-2 bg-[#D61111] text-white border-[#D61111] font-semibold transition-all hover:bg-red-700 whitespace-nowrap"
                                >
                                    {t('category.clearFilter')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
                        ) : filteredListings.length === 0 ? (
                            <div className="col-span-full text-center py-16">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Calendar className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('category.noListingsFound')}</h3>
                                    <p className="text-gray-600">
                                        {t('category.noListingsDescription')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            filteredListings.map((listing) => (
                                <div
                                    key={listing._id || listing.name?.en || Math.random()}
                                    onClick={() => router.push(`/${language}/listing/${listing._id}`)}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                                >
                                    {/* Image Section */}
                                    <div className="h-56 w-full relative bg-gray-100 overflow-hidden">
                                        <Image
                                            src={
                                                listing.images?.[0]
                                                    ? `http://localhost:5000/uploads/${listing.images[0]}`
                                                    : "/no-image.jpg"
                                            }
                                            alt={listing.name?.en || t('category.listingImage')}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        {listing.isFeatured && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#D61111] text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-white" />
                                                    {t('category.featured')}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                                {listing.images?.length || 0} {t('category.photos')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                            {listing.name?.[language] || t('category.unnamedListing')}
                                        </h3>

                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {listing.description?.[language] || t('category.noDescription')}
                                        </p>

                                        {/* Location */}
                                        {listing.location?.city && (
                                            <div className="flex items-center gap-2 text-gray-700 mb-4">
                                                <MapPin className="w-4 h-4 text-[#337914]" />
                                                <span className="text-sm font-medium">{listing.location.city}</span>
                                            </div>
                                        )}

                                        {/* Contact Information */}
                                        <div className="space-y-2 mb-6">
                                            {listing.phone && (
                                                <button
                                                    onClick={() => handleContact('phone', listing.phone)}
                                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#337914] transition-colors w-full"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    <span>{listing.phone}</span>
                                                </button>
                                            )}
                                            {listing.email && (
                                                <button
                                                    onClick={() => handleContact('email', listing.email)}
                                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#337914] transition-colors w-full"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    <span>{listing.email}</span>
                                                </button>
                                            )}
                                            {listing.website && (
                                                <button
                                                    onClick={() => handleContact('website', listing.website)}
                                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#337914] transition-colors w-full"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    <span>{t('category.visitWebsite')}</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <div className="space-y-2">
                                            {listing.booking && (
                                                <button
                                                    onClick={() => handleBooking(listing)}
                                                    className="w-full bg-[#337914] text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                                                >
                                                    {t('category.bookNow')}
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Additional metadata */}
                                            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                                                <span>{t('category.added')} {formatDistanceToNow(new Date(listing.createdAt))} {t('category.ago')}</span>
                                                {listing.updatedAt && listing.updatedAt !== listing.createdAt && (
                                                    <span>{t('category.updated')} {formatDistanceToNow(new Date(listing.updatedAt))} {t('category.ago')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: totalPages }).map((_, idx) => {
                                const page = idx + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
                                            ? "bg-[#337914] text-white shadow-lg transform scale-105"
                                            : "bg-white text-gray-700 border border-gray-300 hover:border-[#337914] hover:text-[#337914]"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Bottom CTA Section */}
                    {filteredListings.length > 0 && (
                        <div className="mt-16 bg-gradient-to-r from-[#337914] to-green-600 rounded-2xl p-8 text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">{t('category.readyToBook')}</h2>
                            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                                {t('category.ctaDescription')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="bg-white text-[#337914] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                                    {t('category.browseAllCategories')}
                                </button>
                                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#337914] transition-all">
                                    {t('category.contactSupport')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}