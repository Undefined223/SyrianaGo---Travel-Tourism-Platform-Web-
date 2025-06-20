"use client";
import { useEffect, useState } from "react";
import { getAllBookings, updateBooking, deleteBooking } from "@/app/lib/https/booking.https";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BookingsTable from "@/app/components/admin/BookingsTable";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    getAllBookings()
      .then((data) => {
        setBookings(data.data || data);
        setLoading(false);
      })
      .catch(() => setBookings([]));
  }, []);

  const handleView = (booking) => {
    router.push(`/dashboard/bookings/${booking._id}`);
  };

  const handleStatusChange = async (booking, newStatus) => {
    try {
      await updateBooking(booking._id, { status: newStatus });
      toast.success(t("admin.bookings.statusUpdated", { status: t(`booking.statusValues.${newStatus}`) }));
      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      toast.error(t("admin.bookings.statusUpdateFailed"));
    }
  };

  const handleDelete = async (booking) => {
    if (!window.confirm(t("admin.bookings.deleteConfirm"))) return;
    try {
      await deleteBooking(booking._id);
      toast.success(t("admin.bookings.deleted"));
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
    } catch (err) {
      toast.error(t("admin.bookings.deleteFailed"));
    }
  };

  const handleEditPaymentMethod = async (booking, newMethod) => {
    try {
      await updateBooking(booking._id, { paymentMethod: newMethod });
      setBookings(prev =>
        prev.map(b => (b._id === booking._id ? { ...b, paymentMethod: newMethod } : b))
      );
      toast.success(t("admin.bookings.paymentMethodUpdated"));
    } catch {
      toast.error(t("admin.bookings.paymentMethodUpdateFailed"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("admin.bookings.loadingTitle")}</h3>
          <p className="text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t("admin.bookings.noBookingsTitle")}</h3>
          <p className="text-gray-600">{t("booking.noBookings")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{t("user.bookings")}</h1>
        <p className="text-blue-100">{t("admin.bookings.manageDescription")}</p>
        <div className="mt-4 flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium">{t("admin.bookings.totalBookings")}</span>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium">{t("booking.statusValues.confirmed")}</span>
            <div className="text-2xl font-bold text-emerald-300">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium">{t("booking.statusValues.pending")}</span>
            <div className="text-2xl font-bold text-amber-300">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <BookingsTable
          bookings={bookings}
          language={language}
          t={t}
          onView={handleView}
          onStatusChange={handleStatusChange}
          onEditPaymentMethod={handleEditPaymentMethod}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}