"use client";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Eye, MoreVertical, Calendar, Users, DollarSign, CreditCard } from "lucide-react";
import { useState } from "react";

export default function BookingsTable({
  bookings,
  language,
  t,
  onView,
  onStatusChange,
  onEditPaymentMethod,
  onEditCheckInOut,
  onDelete
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [paymentValue, setPaymentValue] = useState("");
  const [editingCheckId, setEditingCheckId] = useState(null);
  const [checkInValue, setCheckInValue] = useState("");
  const [checkOutValue, setCheckOutValue] = useState("");

  // Payment method inline edit
  const handleDoubleClickPayment = (booking) => {
    setEditingPaymentId(booking._id);
    setPaymentValue(booking.paymentMethod || "");
  };

  const handlePaymentChange = (booking, value) => {
    if (
      value === booking.paymentMethod ||
      !["stripe", "cod"].includes(value)
    ) {
      setEditingPaymentId(null);
      return;
    }
    onEditPaymentMethod(booking, value);
    setEditingPaymentId(null);
  };

  // Check-in/out inline edit
  const handleDoubleClickCheck = (booking) => {
    setEditingCheckId(booking._id);
    setCheckInValue(booking.details?.checkIn || "");
    setCheckOutValue(booking.details?.checkOut || "");
  };

  const handleCheckSave = (booking) => {
    if (
      checkInValue !== booking.details?.checkIn ||
      checkOutValue !== booking.details?.checkOut
    ) {
      onEditCheckInOut && onEditCheckInOut(booking, checkInValue, checkOutValue);
    }
    setEditingCheckId(null);
  };

  const handleDropdownToggle = (bookingId) => {
    setOpenDropdown(openDropdown === bookingId ? null : bookingId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-200";
      default:
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200";
    }
  };

  const getPaymentMethodIcon = (method) => {
    return method === "stripe" ? (
      <CreditCard className="w-3 h-3 mr-1" />
    ) : (
      <DollarSign className="w-3 h-3 mr-1" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {t("booking.user")}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.listing")}
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.guests")}
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.price")}
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t("booking.dates")}
                </div>
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.status")}
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.payment")}
              </th>
              <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("booking.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking, index) => (
              <tr 
                key={booking._id} 
                className={`hover:bg-blue-50/30 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {(booking.userId?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.userId?.name || t("booking.unknownUser")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.userId?.email || t("booking.noEmail")}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {booking.listingId?.name?.[language] ||
                        booking.listingId?.name?.en ||
                        t("booking.unknownListing")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.listingId?.location?.city || booking.listingId?.location || t("booking.noLocation")}
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {booking.details?.guests ?? "--"}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-900">
                    {booking.details?.price ? `$${booking.details.price}` : "--"}
                  </div>
                </td>

                <td 
                  className="py-4 px-6 cursor-pointer group"
                  onDoubleClick={() => handleDoubleClickCheck(booking)}
                >
                  {editingCheckId === booking._id ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="date"
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={checkInValue}
                          onChange={e => setCheckInValue(e.target.value)}
                        />
                        <span className="text-gray-400">→</span>
                        <input
                          type="date"
                          className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={checkOutValue}
                          onChange={e => setCheckOutValue(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                          onClick={() => handleCheckSave(booking)}
                          type="button"
                        >
                          {t("booking.save")}
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                          onClick={() => setEditingCheckId(null)}
                          type="button"
                        >
                          {t("booking.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group-hover:bg-blue-50 rounded-lg p-2 transition-colors">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.details?.checkIn || "--"}
                          </div>
                          <div className="text-xs text-gray-500">{t("booking.to")}</div>
                          <div className="font-medium text-gray-900">
                            {booking.details?.checkOut || "--"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        {t("booking.doubleClickEdit")}
                      </div>
                    </div>
                  )}
                </td>

                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      booking.status === 'confirmed' ? 'bg-emerald-400' :
                      booking.status === 'pending' ? 'bg-amber-400' :
                      booking.status === 'cancelled' ? 'bg-gray-400' : 'bg-red-400'
                    }`}></div>
                    {t(`booking.statusValues.${booking.status}`) || booking.status}
                  </span>
                </td>

                <td 
                  className="py-4 px-6 cursor-pointer group"
                  onDoubleClick={() => handleDoubleClickPayment(booking)}
                >
                  {editingPaymentId === booking._id ? (
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={paymentValue}
                      autoFocus
                      onChange={e => {
                        setPaymentValue(e.target.value);
                        if (
                          e.target.value !== booking.paymentMethod &&
                          ["stripe", "cod"].includes(e.target.value)
                        ) {
                          onEditPaymentMethod(booking, e.target.value);
                        }
                        setEditingPaymentId(null);
                      }}
                      onBlur={() => setEditingPaymentId(null)}
                      onKeyDown={e => {
                        if (e.key === "Escape") {
                          setEditingPaymentId(null);
                        }
                      }}
                    >
                      <option value="stripe">{t("booking.stripe")}</option>
                      <option value="cod">{t("booking.cod")}</option>
                    </select>
                  ) : (
                    <div className="group-hover:bg-blue-50 rounded-lg p-2 transition-colors">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        {booking.paymentMethod && getPaymentMethodIcon(booking.paymentMethod)}
                        {booking.paymentMethod === 'stripe' ? t("booking.stripe") : 
                         booking.paymentMethod === 'cod' ? t("booking.cod") : 
                         booking.paymentMethod || '--'}
                      </div>
                      <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("booking.doubleClickEdit")}
                      </div>
                    </div>
                  )}
                </td>
               
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title={t("booking.viewDetails")}
                      onClick={() => onView(booking)}
                    >
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <div className="relative">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                        title={t("booking.moreOptions")}
                        type="button"
                        onClick={() => handleDropdownToggle(booking._id)}
                      >
                        <MoreVertical className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                      
                      {openDropdown === booking._id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenDropdown(null)}
                          ></div>
                          <div className="absolute z-20 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="py-1">
                              <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                onClick={() => {
                                  onStatusChange(booking, "confirmed");
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                                {t("booking.markAsConfirmed")}
                              </button>
                              <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                onClick={() => {
                                  onStatusChange(booking, "pending");
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                {t("booking.markAsPending")}
                              </button>
                              <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                  onStatusChange(booking, "cancelled");
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                                {t("booking.markAsCancelled")}
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                onClick={() => {
                                  onDelete(booking);
                                  setOpenDropdown(null);
                                }}
                              >
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                                {t("booking.deleteBooking")}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}