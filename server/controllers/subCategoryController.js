const Category = require('../models/Category');
const SubCategory = require('../models/subCategory');
const { success, error } = require('../utils');

module.exports = {
    // Create subcategory with multilingual name and link to category
    createSubcategory: async (req, res) => {
        try {
            const { name, categoryId } = req.body; // name must be an object: { en, fr, ar }

            if (!name || !name.en || !name.fr || !name.ar) {
                return res.status(400).json({ message: 'All name translations (en, fr, ar) are required' });
            }
            const category = await Category.findById(categoryId);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            const subCategory = await SubCategory.create({ name });


            category.subCategory.push(subCategory._id);
            await category.save();

            success.created(res, subCategory)
        } catch (errorr) {
            error.error(res, errorr.message)
        }
    },

    getSubCategorys: async (req, res) => {
        try {
            const all = await SubCategory.find();
            success.fetched(res, all)
        } catch (err) {
            console.error(err);
            error.error(res, err.message)
        }
    },

    getOneSubCategory: async (req, res) => {
        try {
            const subCategory = await SubCategory.findById(req.params.id);
            if (subCategory) {
                success.fetched(res, subCategory)
            } else {
                res.status(404).json({ error: 'SubCategory not found' });
            }
        } catch (err) {
            error.error(res, err.message)
        }
    },

    getOneSubCategoryandUpdate: async (req, res) => {
        try {
            const updated = await SubCategory.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (updated) {
                success.updated(res, updated)
            } else {
                error.notFound(res, "Subcategory Not Found")
            }
        } catch (err) {
            error.error(res, err.message)
        }
    },

    getOneSubCategoryandDelete: async (req, res) => {
        try {
            const deleted = await SubCategory.findByIdAndDelete(req.params.id);
            if (deleted) {
                // Optionally remove subcategory from any category referencing it
                await Category.updateMany(
                    { subCategory: req.params.id },
                    { $pull: { subCategory: req.params.id } }
                );
               success.deleted(res)
            } else {
                res.status(404).json({ error: 'SubCategory not found' });
            }
        } catch (err) {
            error.error(res, err.message)
        }
    },

    // Find by name in any language (multilingual search)
    getSubCategoryByName: async (req, res) => {
        try {
            const nameRegex = new RegExp(req.params.name, 'i');
            const categories = await SubCategory.find({
                $or: [
                    { 'name.en': nameRegex },
                    { 'name.fr': nameRegex },
                    { 'name.ar': nameRegex }
                ]
            });
            success.fetched(res, categories)
        } catch (error) {
            error.error(res, error.message)
        }
    }
};
