import axiosInstance from "../axios";

// Create a new listing (with images and multilingual fields)
export const createListing = async (formData) => {
  try {
    const res = await axiosInstance.post("/listing", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get all listings
export const getAllListings = async () => {
  try {
    const res = await axiosInstance.get("/listing");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get paginated listings
export const getPaginatedListings = async (page = 1, limit = 12) => {
  try {
    const res = await axiosInstance.get(`/listing/paginated?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Search listings
export const searchListings = async (query) => {
  try {
    const res = await axiosInstance.get(`/listing/search?${query}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get a single listing by ID
export const getListingById = async (id) => {
  try {
    const res = await axiosInstance.get(`/listing/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get listing availability
export const getListingAvailability = async (listingId) => {
  try {
    const res = await axiosInstance.get(`/listing/${listingId}/availability`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get listings by subcategory
export const getListingsBySubcategory = async (subcategoryId) => {
  try {
    const res = await axiosInstance.get(`/listing/subcategory/${subcategoryId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get listings for vendor
export const getVendorListings = async () => {
  try {
    const res = await axiosInstance.get("/listing/vendorlistings");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update a listing
export const updateListing = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/listing/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete a listing
export const deleteListing = async (id) => {
  try {
    const res = await axiosInstance.delete(`/listing/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
export const getBlockedDatesByListing = async (listingId) => {
  const res = await axiosInstance.get(`/blocked/${listingId}`);
  return res.data;
};
export const getReviews = async (listingId) => {
  const res = await axiosInstance.get(`/review/${listingId}/reviews`);
  return res.data;
};

export const createReview = async (listingId, review) => {
  const res = await axiosInstance.post(`/review/${listingId}/reviews`, review, {
    withCredentials: true,
  });
  return res.data;
};