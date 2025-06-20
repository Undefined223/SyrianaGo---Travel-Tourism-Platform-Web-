const { getSubCategorys, getOneSubCategory, getOneSubCategoryandDelete, getSubCategoryByName, getOneSubCategoryandUpdate, createSubcategory } = require('../controllers/subCategoryController')
const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const roleBasedAuthenticationMiddleware = require('../middleware/roleBasedAuthenticationMiddleware');
const router = express.Router();

router.get('/',
     getSubCategorys);
router.get('/name/:name', getSubCategoryByName);
router.get('/:id', getOneSubCategory);
router.post('/',
//     requireAuth,
// roleBasedAuthenticationMiddleware("admin"),
     createSubcategory);
router.put('/:id',
    requireAuth,
roleBasedAuthenticationMiddleware("admin"),
     getOneSubCategoryandUpdate);
router.delete('/:id',
    requireAuth,
roleBasedAuthenticationMiddleware("admin"),
     getOneSubCategoryandDelete);

module.exports = router;