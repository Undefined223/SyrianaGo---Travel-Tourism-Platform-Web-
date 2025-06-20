"use client";
import BookingChatSidebar from "@/app/components/BookingChatSidebar";
import Loading from "@/app/components/Loading";
import { useUser } from "@/app/contexts/UserContext";
import { getVendorBookings } from "@/app/lib/https/booking.https";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";

const statusColors = {
  pending: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
  confirmed: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
  completed: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
  failed: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200",
};

const VendorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getVendorBookings();
        setBookings(data);
      } catch (error) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleOpenChat = (booking) => {
    setSelectedBooking(booking);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedBooking(null);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-slate-600 font-medium">{t("bookings.loading")}</span>
      </div>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {t("bookings.title")}
            </h1>
          </div>
          <p className="text-gray-600 ml-11">{t("bookings.subtitle")}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("bookings.emptyTitle")}</h3>
            <p className="text-gray-500">{t("bookings.emptyDesc")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Stats Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-lg font-semibold">{t("bookings.totalBookings")}</h2>
                  <p className="text-blue-100">{t("bookings.showing", { count: bookings.length })}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{bookings.length}</div>
                  <div className="text-sm text-blue-100">{t("bookings.activeRecords")}</div>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.customer")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.property")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.checkIn")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.checkOut")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.guests")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.payment")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.total")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.created")}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("bookings.chat")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking, index) => (
                    <tr key={booking._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {booking.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {booking.userId?.name || t("bookings.unknownUser")}
                            </div>
                            <div className="text-sm text-gray-500">{booking.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {booking.listingId?.name?.en || t("bookings.propertyName")}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.listingId?.location?.city || t("bookings.location")}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">
                            {booking.details?.checkIn
                              ? new Date(booking.details.checkIn).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                              : "--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">
                            {booking.details?.checkOut
                              ? new Date(booking.details.checkOut).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                              : "--"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">
                            {booking.details?.guests || 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status] || "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200"
                            } shadow-sm`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></div>
                          {t(`bookings.statuses.${booking.status}`) || (booking.status.charAt(0).toUpperCase() + booking.status.slice(1))}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {booking.paymentMethod || t("bookings.notSpecified")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${Number(booking.details?.price || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                            : "--"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition"
                          onClick={() => handleOpenChat(booking)}
                          title={t("bookings.openChat")}
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.2A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {t("bookings.chat")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {chatOpen && selectedBooking && user && (
          <BookingChatSidebar
            open={chatOpen}
            onClose={handleCloseChat}
            booking={selectedBooking}
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
};

export default VendorBookings;