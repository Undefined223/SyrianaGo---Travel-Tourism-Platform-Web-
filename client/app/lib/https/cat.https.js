import axiosInstance from "../axios";

// Create a new category (with icon image and multilingual name)
export const createCategory = async (formData) => {
  try {
    const res = await axiosInstance.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    // Make sure to return the array directly
    return res.data // adjust based on your backend response
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get a single category by ID
export const getCategory = async (id) => {
  try {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update a category (with optional name and icon)
export const updateCategory = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/categories/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getCategoryWithListings = async (id, page = 1, limit = 12) => {
  try {
    const res = await axiosInstance.get(`/categories/listings/${id}?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
