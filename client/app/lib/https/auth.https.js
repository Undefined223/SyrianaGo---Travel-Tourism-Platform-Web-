import axiosInstance from "../axios";

const login = async (credentials) => {
  try {
    const res = await axiosInstance.post("/auth/login", credentials);
    if (res.data.twoFactorRequired) {
      return { twoFactorRequired: true, email: credentials.email }; 
    }
    const accessToken = res.data.accessToken;

    // Store tokens in localStorage
    localStorage.setItem("accessToken", accessToken);

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};
const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`/auth/register`, userData);

    return response?.data || {};
  } catch (error) {
    throw error.response?.data || error;
  }
};

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post(`/auth/refresh-token`);
    const accessToken = response.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    throw error.response?.data || error;
  }
};



// Google OAuth login redirect (front-end initiates)

const loginWithGoogle = () => {
  if (typeof window !== "undefined") {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }
};

const addToWishlist = async (listingId) => {
  const res = await axiosInstance.post(`/auth/wishlist/${listingId}`);
  return res.data;
};

const getWishlist = async () => {
  const res = await axiosInstance.get(`/auth/wishlist`);
  return res.data;
};

const removeFromWishlist = async (listingId) => {
  const res = await axiosInstance.delete(`/auth/wishlist/${listingId}`);
  return res.data;
};

// 2FA
const verify2FA = async ({ email, code }) => {
  const res = await axiosInstance.post(`/auth/2fa`, { email, code });
  return res.data;
};

const toggle2FA = async () => {
  const res = await axiosInstance.post(`/auth/toggle-2fa`);
  return res.data;
};

// Get user bookings
const getUserBookings = async () => {
  const res = await axiosInstance.get(`/auth/bookings`);
  return res.data;
};
// Google Callback – typically handled server-side; not used directly in client-side code

const getCurrentUser = async () => {
  console.log("Calling /auth/me endpoint...");
  try {
    const res = await axiosInstance.get('/auth/me');
    console.log("Response from /auth/me:", res);
    return res;
  } catch (err) {
    console.error("Error in getCurrentUser (frontend):", err);
    throw err;
  }
}

const getUserRecentActivities = async (userId, lang = 'en') => {
  const res = await axiosInstance.get(`/auth/${userId}/recent-activities?lang=${lang}`);
  return res.data;
};

const updateUser = async (data) => {
  try {
    const res = await axiosInstance.put("/auth/me", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

 const getAllUsers = async () => {
  const res = await axiosInstance.get("/auth/admin/users");
  return res.data;
};

 const deleteUserById = async (id) => {
  const res = await axiosInstance.delete(`/auth/admin/users/${id}`);
  return res.data;
};

 const updateUserByAdmin = async (userId, data) => {
  const res = await axiosInstance.put(`/auth/admin/users/${userId}`, data);
  return res.data;
};

export {
  login,
  register,
  refreshToken,
  loginWithGoogle,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  verify2FA,
  toggle2FA,
  getUserBookings,
  getCurrentUser,
  getUserRecentActivities,
  updateUser,
  getAllUsers,
  deleteUserById,
  updateUserByAdmin
};