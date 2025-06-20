import axiosInstance from "../axios";

// Create a new subcategory
export const createSubCategory = async (payload) => {
  try {
    const res = await axiosInstance.post("/subCategories", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get all subcategories
export const getAllSubCategories = async () => {
  try {
    const res = await axiosInstance.get("/subCategories");
    return res.data.data || res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get a single subcategory by ID
export const getSubCategory = async (id) => {
  try {
    const res = await axiosInstance.get(`/subCategories/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update a subcategory
export const updateSubCategory = async (id, payload) => {
  try {
    const res = await axiosInstance.put(`/subCategories/${id}`, payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete a subcategory
export const deleteSubCategory = async (id) => {
  try {
    const res = await axiosInstance.delete(`/subCategories/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};