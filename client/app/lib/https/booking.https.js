import axiosInstance from "../axios";

// Create a booking (handles both COD and Stripe)
export const createBooking = async (bookingPayload) => {
  const res = await axiosInstance.post("/booking", bookingPayload);
  return res.data;
};

// Get all bookings (admin or for dashboard)
export const getAllBookings = async () => {
  const res = await axiosInstance.get("/booking");
  return res.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
  const res = await axiosInstance.get(`/booking/${id}`);
  return res.data;
};

// Update booking
export const updateBooking = async (id, updatePayload) => {
  console.log("Updating booking with ID:", id, "Payload:", updatePayload);
  const res = await axiosInstance.put(`/booking/${id}`, updatePayload);
  return res.data;
};

// Delete booking
export const deleteBooking = async (id) => {
  const res = await axiosInstance.delete(`/booking/${id}`);
  return res.data;
};

// Get vendor bookings (for vendor dashboard)
export const getVendorBookings = async () => {
  const res = await axiosInstance.get("/booking/vendor");
  return res.data;
};

// Retry payment for a booking (if needed)
export const retryBookingPayment = async (bookingId) => {
  const res = await axiosInstance.post(`/booking/${bookingId}/retry-payment`);
  return res.data;
};