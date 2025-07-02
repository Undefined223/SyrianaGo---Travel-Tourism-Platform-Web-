import { useEffect, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useUser } from "@/app/contexts/UserContext";
import { getUserBookings } from "@/app/lib/https/auth.https";
import { Calendar } from "lucide-react";
import BookingChatSidebar from "@/app/components/BookingChatSideBar";

export default function UserBookings() {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat sidebar state
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  console.log("Sidebar state", { chatOpen, selectedBooking, user });

  console.log(selectedBooking)
  useEffect(() => {
    getUserBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-50 text-[#337914] border border-[#337914]/20';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-[#D61111] border border-[#D61111]/20';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white">
        <div className="inline-flex items-center justify-center w-8 h-8 border-4 border-gray-200 border-t-[#337914] rounded-full animate-spin mb-4"></div>
        <div className="text-gray-600">{t("common.loading") || "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">{t("user.bookings")}</h1>
        <div className="h-1 w-16 bg-[#337914] rounded-full"></div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-[#337914]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-[#337914]" />
          </div>
          <p className="text-gray-500 text-lg">{t("booking.noBookings") || "No bookings found."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-14 h-14 bg-[#337914] rounded-2xl flex items-center justify-center shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl text-black truncate pr-4">
                      {booking.listingId?.name?.[language] ||
                        booking.listingId?.name?.en ||
                        t("booking.unknownListing") ||
                        "Listing"}
                    </h3>

                    <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusBadgeColor(booking.status)}`}>
                      {booking.status || t("booking.unknownStatus")}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center text-gray-700">
                      <span className="font-semibold mr-3">{t("booking.date")}:</span>
                      <span className="text-black font-medium">
                        {new Date(booking.createdAt).toLocaleDateString(language)}
                      </span>
                    </div>
                    <button
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setChatOpen(true);
                      }}
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Sidebar */}
      {chatOpen && selectedBooking && (
        <BookingChatSidebar
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          booking={selectedBooking}
          currentUser={user}
        />
      )}
    </div>
  );
}