"use client";
import { getVendorBookings } from "@/app/lib/https/booking.https";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-gray-50 text-gray-600 border-gray-200",
};

const VendorOverview = () => {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Summary stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    failed: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getVendorBookings();
        setBookings(data);

        // Calculate stats
        let total = data.length;
        let pending = data.filter(b => b.status === "pending").length;
        let confirmed = data.filter(b => b.status === "confirmed").length;
        let cancelled = data.filter(b => b.status === "cancelled").length;
        let failed = data.filter(b => b.status === "failed").length;
        let revenue = data
          .filter(b => b.status === "confirmed")
          .reduce((sum, b) => sum + (Number(b.details?.price) || 0), 0);

        setStats({ total, pending, confirmed, cancelled, failed, revenue });
      } catch (error) {
        setBookings([]);
        setStats({ total: 0, pending: 0, confirmed: 0, cancelled: 0, failed: 0, revenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-slate-600 font-medium">{t("overview.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("overview.title")}</h1>
          <p className="text-gray-600">{t("overview.subtitle")}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t("overview.totalBookings")}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t("overview.pending")}</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t("overview.confirmed")}</p>
                <p className="text-3xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t("overview.cancelled")}</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{t("overview.revenue")}</p>
                <p className="text-3xl font-bold text-emerald-600">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t("overview.recentBookings")}</h2>
            <p className="text-sm text-gray-600 mt-1">{t("overview.latestActivity")}</p>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t("overview.noBookings")}</h3>
              <p className="text-gray-500">{t("overview.noBookingsDesc")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.customer")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.listing")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.checkIn")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.checkOut")}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.guests")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.status")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.total")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("overview.created")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.slice(0, 10).map((booking, index) => (
                    <tr key={booking._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {booking.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{booking.userId?.name || t("overview.unknown")}</div>
                            <div className="text-sm text-gray-500">{booking.userId?.email || '--'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.listingId?.name?.en || t("overview.unknownListing")}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.listingId?.location?.city || '--'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.details?.checkIn
                          ? new Date(booking.details.checkIn).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.details?.checkOut
                          ? new Date(booking.details.checkOut).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center h-8 w-8 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {booking.details?.guests || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[booking.status] || "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full mr-2 ${
                            booking.status === 'pending' ? 'bg-amber-400' :
                            booking.status === 'confirmed' ? 'bg-blue-400' :
                            booking.status === 'completed' ? 'bg-emerald-400' :
                            booking.status === 'cancelled' ? 'bg-red-400' :
                            'bg-gray-400'
                          }`}></span>
                          {t(`overview.statuses.${booking.status}`) || (booking.status.charAt(0).toUpperCase() + booking.status.slice(1))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        ${Number(booking.details?.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;