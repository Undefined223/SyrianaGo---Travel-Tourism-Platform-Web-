import Category from '../models/Category.js';
import Listing from '../models/Listing.js';
import { error, success } from '../utils.js';


export const createCategory = async (req, res) => {
  try {
    const parsedName = JSON.parse(req.body.name);
    const slug = {
      en: parsedName.en.toLowerCase().replace(/\s+/g, '-'),
      fr: parsedName.fr.toLowerCase().replace(/\s+/g, '-'),
      ar: parsedName.ar.toLowerCase().replace(/\s+/g, '-')
    };  
    const icon = req.file ? req.file.filename : null;

    if (!icon) {
      return res.status(400).json({ message: 'Icon image is required' });
    }

    const category = await Category.create({ name: parsedName, slug, icon });

    success.created(res, category);
  } catch (err) {
    error.error(res, err.message);
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    success.fetched(res, categories)
  } catch (err) {
    error.error(res, err.message)
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    success.fetched(res, category)
  } catch (err) {
    error.error(res, err.message)

  }
};

export const updateCategory = async (req, res) => {
  try {
    const updates = {};
    console.log(req.body);
    console.log(req.file)

    if (req.body.name) {
      updates.name = JSON.parse(req.body.name);
      updates.slug = {
        en: updates.name.en.toLowerCase().replace(/\s+/g, '-'),
        fr: updates.name.fr.toLowerCase().replace(/\s+/g, '-'),
        ar: updates.name.ar.toLowerCase().replace(/\s+/g, '-')
      };
    }

    if (req.file) {
      updates.icon = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }

    success.updated(res, updated);
  } catch (err) {
    error.error(res, err.message);
  }
};



export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    success.deleted(res)    
  } catch (err) {
        error.error(res, err.message)

  }
};

export const getListingsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).populate("subCategory");
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategoryIds = category.subCategory.map(sub => sub._id);

    // Pass query to pagination middleware
    req.baseQuery = { subcategory: { $in: subcategoryIds } };
    req.category = category;
    req.subcategories = category.subCategory;

    next();
  } catch (err) {
    error.error(res, err.message);
  }
};
