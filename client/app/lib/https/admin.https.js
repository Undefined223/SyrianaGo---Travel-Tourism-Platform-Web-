import axiosInstance from "../axios";

export const getAdminOverviewStats = async () => {
  const res = await axiosInstance.get("/admin/overview");
  return res.data;
};

export const getBookingTrends = async () => {
  const res = await axiosInstance.get("/admin/booking-trends");
  return res.data; // Should be [{ month: "Jan", bookings: 12 }, ...]
};


export const getDashboardAnalytics = async () => {
  const res = await axiosInstance.get("/admin/analytics");
  return res.data; // Should be [{ month: "Jan", bookings: 12 }, ...]
};