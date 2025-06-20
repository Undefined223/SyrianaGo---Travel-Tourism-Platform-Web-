import React from "react";

const statusColors = {
  pending: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
  confirmed: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
  completed: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
  failed: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200",
};

const BookingRow = ({ booking, onChatOpen }) => {
  return (
    <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {booking.userId?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
              {booking.userId?.name || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-500">{booking.userId?.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {booking.listingId?.name?.en || 'Property Name'}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {booking.listingId?.location?.city || 'Location'}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {booking.details?.checkIn ? (
          <span className="text-sm font-medium text-gray-900">
            {new Date(booking.details.checkIn).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : "--"}
      </td>
      <td className="px-6 py-4">
        {booking.details?.checkOut ? (
          <span className="text-sm font-medium text-gray-900">
            {new Date(booking.details.checkOut).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : "--"}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
          <span className="text-sm font-semibold text-gray-700">
            {booking.details?.guests || 1}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
            statusColors[booking.status] || statusColors["failed"]
          } shadow-sm`}
        >
          <div className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></div>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 capitalize">{booking.paymentMethod || "Not specified"}</td>
      <td className="px-6 py-4 text-right font-bold text-gray-900">
        ${Number(booking.details?.price || 0).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        {booking.createdAt
          ? new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "--"}
      </td>
      <td className="px-6 py-4 text-center">
        <button
          className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition"
          onClick={() => onChatOpen(booking)}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.2A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>
      </td>
    </tr>
  );
};

export default BookingRow;
