"use client";
import { useEffect, useState } from "react";
import { getAllListings, getReviews, getVendorListings } from "@/app/lib/https/listing.https";
import { Star } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useLanguage } from "@/app/contexts/LanguageContext";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const VendorReviews = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState("all");
  const [sort, setSort] = useState("newest");

  // Helper for "x days ago"
  const formatDistanceToNow = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return `${diff}${t("reviews.s")}`;
    if (diff < 3600) return `${Math.floor(diff / 60)}${t("reviews.m")}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t("reviews.h")}`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}${t("reviews.d")}`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}${t("reviews.mo")}`;
    return `${Math.floor(diff / 31536000)}${t("reviews.y")}`;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const listingsRes = await getVendorListings();
        const listingArr = listingsRes.data || listingsRes;
        setListings(listingArr);

        const allReviews = [];
        await Promise.all(
          listingArr.map(async (listing) => {
            const res = await getReviews(listing._id);
            (res.data || res).forEach((review) => {
              allReviews.push({
                ...review,
                listingName: listing.name?.en || listing.name?.fr || listing.name?.ar || t("reviews.listing"),
                listingId: listing._id,
              });
            });
          })
        );
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(allReviews);
      } catch {
        setReviews([]);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((r) => selectedListing === "all" || r.listingId === selectedListing)
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return 0;
    });

  // Analytics
  const totalReviews = filteredReviews.length;
  const avgRating =
    totalReviews === 0
      ? 0
      : (
          filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(2);

  // Ratings distribution for chart
  const ratingsDist = [0, 0, 0, 0, 0];
  filteredReviews.forEach((r) => {
    ratingsDist[r.rating - 1]++;
  });

  // Review count per listing
  const reviewCountPerListing = {};
  reviews.forEach((r) => {
    reviewCountPerListing[r.listingId] = (reviewCountPerListing[r.listingId] || 0) + 1;
  });

  // Top 3 listings by review count
  const topListings = listings
    .map((l) => ({
      ...l,
      count: reviewCountPerListing[l._id] || 0,
      avg:
        reviews.filter((r) => r.listingId === l._id).reduce((sum, r) => sum + r.rating, 0) /
        (reviewCountPerListing[l._id] || 1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (loading)
    return (
      <div className="p-6">
        {t("reviews.loading")}
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t("reviews.title")}</h2>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-lg font-semibold">{t("reviews.total")}</div>
          <div className="text-2xl font-bold">{totalReviews}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-lg font-semibold">{t("reviews.average")}</div>
          <div className="text-2xl font-bold flex items-center justify-center gap-1">
            {avgRating} <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-lg font-semibold">{t("reviews.topListing")}</div>
          <div className="text-base font-bold">
            {topListings[0]?.name?.en || topListings[0]?.name?.fr || topListings[0]?.name?.ar || "--"}
          </div>
          <div className="text-xs text-slate-500">{topListings[0]?.count || 0} {t("reviews.reviews")}</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-lg font-semibold">{t("reviews.export")}</div>
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            onClick={() => {
              // Export as CSV
              const csv =
                "Reviewer,Rating,Comment,Listing,Date\n" +
                filteredReviews
                  .map(
                    (r) =>
                      `"${r.userId?.name || ""}",${r.rating},"${r.comment.replace(/"/g, '""')}",${r.listingName},${new Date(r.createdAt).toLocaleString()}`
                  )
                  .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "reviews.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            {t("reviews.exportCsv")}
          </button>
        </div>
      </div>

      {/* Ratings Distribution Chart */}
      <div className="mb-8 max-w-xl">
        <h4 className="font-semibold mb-2">{t("reviews.ratingsDist")}</h4>
        <Bar
          data={{
            labels: [
              `1${t("reviews.star")}`,
              `2${t("reviews.star")}`,
              `3${t("reviews.star")}`,
              `4${t("reviews.star")}`,
              `5${t("reviews.star")}`,
            ],
            datasets: [
              {
                label: t("reviews.reviews"),
                data: ratingsDist,
                backgroundColor: [
                  "#f87171",
                  "#fbbf24",
                  "#fde68a",
                  "#a7f3d0",
                  "#34d399",
                ],
                borderRadius: 6,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, precision: 0 } },
          }}
          height={180}
        />
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedListing}
          onChange={(e) => setSelectedListing(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">{t("reviews.allListings")}</option>
          {listings.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name?.en || l.name?.fr || l.name?.ar || t("reviews.listing")}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="newest">{t("reviews.newest")}</option>
          <option value="oldest">{t("reviews.oldest")}</option>
          <option value="highest">{t("reviews.highest")}</option>
          <option value="lowest">{t("reviews.lowest")}</option>
        </select>
      </div>

      {/* Top 3 Listings by Review Count */}
      <div className="mb-8">
        <h4 className="font-semibold mb-2">{t("reviews.top3")}</h4>
        <div className="flex flex-wrap gap-4">
          {topListings.map((l, idx) => (
            <div key={l._id} className="bg-slate-50 rounded-xl p-4 min-w-[180px] flex-1">
              <div className="text-lg font-bold mb-1">
                #{idx + 1} {l.name?.en || l.name?.fr || l.name?.ar || t("reviews.listing")}
              </div>
              <div className="text-xs text-slate-500 mb-1">{l.count} {t("reviews.reviews")}</div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{l.avg ? l.avg.toFixed(2) : "0.00"}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div>{t("reviews.noReviews")}</div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((r) => (
            <div
              key={r._id}
              className={`bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4 ${
                r.rating <= 2 ? "border-l-4 border-red-400" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{r.userId?.name || t("reviews.user")}</span>
                  <span className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) =>
                      i < r.rating ? (
                        <Star key={i} className="w-4 h-4 fill-yellow-400" />
                      ) : (
                        <Star key={i} className="w-4 h-4" />
                      )
                    )}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    {r.createdAt ? formatDistanceToNow(r.createdAt) + " " + t("reviews.ago") : ""}
                  </span>
                  {r.userId?.email && (
                    <span className="text-xs text-slate-400 ml-2">{r.userId.email}</span>
                  )}
                </div>
                <div className="text-slate-700 mb-2">{r.comment}</div>
                <div className="text-xs text-slate-500">
                  {t("reviews.listing")}: <span className="font-semibold">{r.listingName}</span>
                  {" "}
                  <span className="text-slate-400">({r.listingId.slice(-8)})</span>
                </div>
                {r.rating <= 2 && (
                  <div className="text-xs text-red-500 font-semibold mt-1">{t("reviews.lowRating")}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorReviews;