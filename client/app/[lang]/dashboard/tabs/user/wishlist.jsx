import { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useUser } from "@/app/contexts/UserContext";
import { getWishlist, removeFromWishlist } from "@/app/lib/https/auth.https";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const { t, language } = useLanguage();
    const { user } = useUser();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getWishlist()
            .then(setWishlist)
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (listingId) => {
        await removeFromWishlist(listingId);
        setWishlist((prev) => prev.filter(item => item._id !== listingId));
    };

    if (loading) {
        return (
            <div className="p-8 text-center bg-white">
                <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                <div className="text-gray-600">{t("common.loading") || "Loading..."}</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">{t("user.wishlist")}</h1>
                <div className="h-1 w-16" style={{ background: "#337914", borderRadius: "9999px" }}></div>
            </div>
            {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">{t("wishlist.emptyTitle") || "No favorites yet"}</h3>
                    <p className="text-gray-500 text-lg">{t("wishlist.emptyText") || "Your wishlist is empty."}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex items-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <Link
                                href={`/${language}/listing/${item._id}`}
                                className="flex items-center flex-1 min-w-0"
                                style={{ textDecoration: "none" }}
                            >
                                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mr-4">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${item.images[0]}`}
                                            alt={item.name?.[language] || item.name?.en || "Listing"}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <Heart className="w-8 h-8 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg text-black truncate group-hover:text-[#337914] transition-colors">
                                        {item.name?.[language] || item.name?.en || t("booking.unknownListing") || "Listing"}
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1 truncate">
                                        {item.description?.[language] || item.description?.en || ""}
                                    </div>
                                </div>
                                <ArrowRight className="ml-4 w-5 h-5 text-[#337914] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <button
                                className="ml-4 px-4 py-2 bg-[#D61111] text-white rounded-lg hover:bg-[#b80d0d] transition"
                                onClick={() => handleRemove(item._id)}
                                aria-label={t("wishlist.remove") || "Remove"}
                            >
                                {t("wishlist.remove") || "Remove"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}