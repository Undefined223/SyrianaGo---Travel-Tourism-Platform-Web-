"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/contexts/UserContext";
import { createReview, getReviews } from "../lib/https/listing.https";
import { FaStar as Star, FaUser as User, FaClock as Clock, FaQuoteLeft as QuoteLeft } from "react-icons/fa";

export default function Reviews({ listingId }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!listingId) return;
    setReviewLoading(true);
    getReviews(listingId)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setReviewLoading(false));
  }, [listingId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError("");
    try {
      await createReview(listingId, newReview);
      setNewReview({ rating: 5, comment: "" });
      const updated = await getReviews(listingId);
      setReviews(updated);
    } catch (err) {
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDistanceToNow = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`;
    return `${Math.floor(diff / 31536000)}y`;
  };

  const renderStars = (rating, filled = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? filled
              ? "text-yellow-400 fill-current"
              : "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                Guest Reviews
              </h3>
              {reviews.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-2xl font-bold" style={{ color: '#337914' }}>
                      {averageRating}
                    </span>
                  </div>
                  <span className="text-gray-500" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                    Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            
            {reviews.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: '#337914'
                          }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Content */}
        <div className="p-8">
          {reviewLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#337914' }}></div>
            </div>
          ) : (
            <>
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#337914', opacity: 0.1 }}>
                    <Star className="w-10 h-10" style={{ color: '#337914' }} />
                  </div>
                  <h4 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                    No Reviews Yet
                  </h4>
                  <p className="text-gray-500" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                    Be the first to share your experience with this listing.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#337914' }}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <h5 className="font-bold text-lg" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                                {r.userId?.name || "Guest User"}
                              </h5>
                              <div className="flex">
                                {renderStars(r.rating)}
                              </div>
                            </div>
                            
                            {r.createdAt && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                                  {formatDistanceToNow(r.createdAt)} ago
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="relative">
                            <QuoteLeft className="w-5 h-5 text-gray-300 mb-2" />
                            <p className="text-gray-700 text-lg leading-relaxed pl-6" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                              {r.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Form */}
              {user ? (
                <div className="bg-gradient-to-r from-green-50 to-white rounded-2xl p-8 border border-gray-100">
                  <h4 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                    Share Your Experience
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <label className="font-semibold text-lg" style={{ fontFamily: "'Times New Roman Custom', serif", color: '#000000' }}>
                        Your Rating:
                      </label>
                      <div className="flex items-center gap-4">
                        <select
                          value={newReview.rating}
                          onChange={e => setNewReview(r => ({ ...r, rating: Number(e.target.value) }))}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-lg font-medium"
                          style={{ 
                            fontFamily: "'Times New Roman Custom', serif",
                            focusRingColor: '#337914'
                          }}
                        >
                          {[5, 4, 3, 2, 1].map(n => (
                            <option key={n} value={n}>
                              {n} Star{n > 1 ? "s" : ""} - {n === 5 ? "Excellent" : n === 4 ? "Very Good" : n === 3 ? "Good" : n === 2 ? "Fair" : "Poor"}
                            </option>
                          ))}
                        </select>
                        <div className="flex">
                          {renderStars(newReview.rating)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-semibold text-lg mb-3" style={{ fontFamily: "'Times New Roman Custom', serif", color: '#000000' }}>
                        Your Review:
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 text-lg resize-none"
                        style={{ 
                          fontFamily: "'Times New Roman Custom', serif",
                          focusRingColor: '#337914'
                        }}
                        rows={4}
                        placeholder="Tell others about your experience with this listing..."
                        required
                      />
                    </div>
                    
                    {reviewError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-medium" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                          {reviewError}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={handleReviewSubmit}
                        className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{ 
                          background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #337914 0%, #2d6b12 100%)',
                          fontFamily: "'Tennyson BC', serif"
                        }}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Star className="w-5 h-5" />
                            Submit Review
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 px-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#337914', opacity: 0.1 }}>
                    <User className="w-8 h-8" style={{ color: '#337914' }} />
                  </div>
                  <h4 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Tennyson BC', serif", color: '#000000' }}>
                    Sign In to Leave a Review
                  </h4>
                  <p className="text-gray-600" style={{ fontFamily: "'Times New Roman Custom', serif" }}>
                    Share your experience and help others make informed decisions.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}