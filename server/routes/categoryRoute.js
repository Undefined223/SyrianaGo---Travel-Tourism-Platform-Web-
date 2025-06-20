const { createCategory, getCategorys, getOneCategory, getOneCategoryandDelete, getCategoryByName, getOneCategoryandUpdate, addSubCategoryToCategory, removeSubCategoryFromCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById, searchCategoryByName, getAllCategories, deleteCategory, updateCategory, getListingsByCategory } = require('../controllers/categoryController')
const express = require('express');
const { upload } = require('../utils/storage');
const { requireAuth } = require('../middleware/authMiddleware');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');
const pagination = require('../middleware/pagination');
const Listing = require('../models/Listing');
const router = express.Router();

router.post('/', upload.single('icon'),
    // requireAuth,
    // roleBasedAuthenticationMiddleware("admin"),
    createCategory);
router.get('/',
     getAllCategories);


   router.get(
  '/listings/:id',
  getListingsByCategory,
  pagination(Listing),
  (req, res) => {
    res.json({
      category: req.category,
      subcategories: req.subcategories,
      listings: res.paginatedResults.results,
      total: res.paginatedResults.total,
      page: res.paginatedResults.page,
      totalPages: res.paginatedResults.totalPages,
    });
  }
);

router.put('/:id', upload.single('icon'),
requireAuth,
roleBasedAuthenticationMiddleware("admin", "vendor"),
 updateCategory);

router.delete('/:id',
    requireAuth,
roleBasedAuthenticationMiddleware("admin"),
     deleteCategory);


module.exports = router;