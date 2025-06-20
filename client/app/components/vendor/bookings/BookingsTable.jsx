import React from "react";
import BookingsStats from "./BookingsStats";
import BookingRow from "./BookingRow";

const BookingsTable = ({ bookings, onChatOpen }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <BookingsStats total={bookings.length} />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
            <tr>
              {["Customer", "Property", "Check In", "Check Out", "Guests", "Status", "Payment", "Total", "Created", "Chat"].map((heading) => (
                <th
                  key={heading}
                  className={`px-6 py-4 ${["Guests", "Status", "Chat"].includes(heading) ? "text-center" : "text-left"} text-xs font-semibold text-gray-700 uppercase tracking-wider`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <BookingRow key={booking._id} booking={booking} onChatOpen={onChatOpen} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
