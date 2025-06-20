"use client";
import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
} from "@/app/lib/https/cat.https";
import {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
} from "@/app/lib/https/subcat.https";
import { useLanguage } from "@/app/contexts/LanguageContext";

const VendorCategories = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // For create forms
  const [newCat, setNewCat] = useState({ en: "", fr: "", ar: "", icon: null });
  const [newSub, setNewSub] = useState({ en: "", fr: "", ar: "", categoryId: "" });

  // For editing
  const [editCatId, setEditCatId] = useState(null);
  const [editCat, setEditCat] = useState({ en: "", fr: "", ar: "" });
  const [editSubId, setEditSubId] = useState(null);
  const [editSub, setEditSub] = useState({ en: "", fr: "", ar: "" });

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cats = await getAllCategories();
        const subs = await getAllSubCategories();
        setCategories(cats.data || cats);
        setSubcategories(subs.data || subs);
      } catch {
        setCategories([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", JSON.stringify({ en: newCat.en, fr: newCat.fr, ar: newCat.ar }));
    if (newCat.icon) formData.append("icon", newCat.icon);
    await createCategory(formData);
    setNewCat({ en: "", fr: "", ar: "", icon: null });
    const cats = await getAllCategories();
    setCategories(cats.data || cats);
  };

  // Edit category
  const handleEditCategory = async (catId) => {
    const formData = new FormData();
    formData.append("name", JSON.stringify(editCat));
    if (editCat.iconFile) {
      formData.append("icon", editCat.iconFile);
    }

    await updateCategory(catId, formData);
    setEditCatId(null);
    const cats = await getAllCategories();
    setCategories(cats.data || cats);
  };

  // Create subcategory
  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    await createSubCategory({
      name: { en: newSub.en, fr: newSub.fr, ar: newSub.ar },
      categoryId: newSub.categoryId,
    });
    setNewSub({ en: "", fr: "", ar: "", categoryId: "" });
    const subs = await getAllSubCategories();
    setSubcategories(subs.data || subs);
    const cats = await getAllCategories();
    setCategories(cats.data || cats);
  };

  // Edit subcategory
  const handleEditSubCategory = async (subId) => {
    await updateSubCategory(subId, { name: editSub });
    setEditSubId(null);
    const subs = await getAllSubCategories();
    setSubcategories(subs.data || subs);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("dashboard.categories")} & {t("common.subcategories")}</h1>
          <p className="text-gray-600">{t("dashboard.manageCategories") || "Manage your product categories and subcategories"}</p>
        </div>

        {/* Create Category Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t("dashboard.addCategory") || "Add New Category"}
            </h2>
          </div>
          <div className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end" onSubmit={handleCreateCategory}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameEn") || "English Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameEn") || "Category name in English"}
                  value={newCat.en}
                  onChange={e => setNewCat({ ...newCat, en: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameFr") || "French Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameFr") || "Nom en français"}
                  value={newCat.fr}
                  onChange={e => setNewCat({ ...newCat, fr: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameAr") || "Arabic Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameAr") || "الاسم بالعربية"}
                  value={newCat.ar}
                  onChange={e => setNewCat({ ...newCat, ar: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.icon") || "Icon"}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setNewCat({ ...newCat, icon: e.target.files[0] })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t("dashboard.addCategory") || "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Create Subcategory Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t("dashboard.addSubcategory") || "Add New Subcategory"}
            </h2>
          </div>
          <div className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end" onSubmit={handleCreateSubCategory}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.parent") || "Parent Category"}</label>
                <select
                  value={newSub.categoryId}
                  onChange={e => setNewSub({ ...newSub, categoryId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">{t("category.selectCategory") || "Select Category"}</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name?.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameEn") || "English Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameEn") || "Subcategory name in English"}
                  value={newSub.en}
                  onChange={e => setNewSub({ ...newSub, en: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameFr") || "French Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameFr") || "Nom en français"}
                  value={newSub.fr}
                  onChange={e => setNewSub({ ...newSub, fr: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("category.nameAr") || "Arabic Name"}</label>
                <input
                  type="text"
                  placeholder={t("category.nameAr") || "الاسم بالعربية"}
                  value={newSub.ar}
                  onChange={e => setNewSub({ ...newSub, ar: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {t("dashboard.addSubcategory") || "Add Subcategory"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories Table */}
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            {t("dashboard.categoriesOverview") || "Categories Overview"}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboard.categories")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("category.icon") || "Icon"}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("common.subcategories")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("dashboard.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(categories) && categories.map(cat => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Category Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editCatId === cat._id ? (
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">EN</label>
                          <input
                            type="text"
                            value={editCat.en}
                            onChange={e => setEditCat({ ...editCat, en: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t("category.nameEn") || "English"}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">FR</label>
                          <input
                            type="text"
                            value={editCat.fr}
                            onChange={e => setEditCat({ ...editCat, fr: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t("category.nameFr") || "French"}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">AR</label>
                          <input
                            type="text"
                            value={editCat.ar}
                            onChange={e => setEditCat({ ...editCat, ar: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t("category.nameAr") || "Arabic"}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">EN</span>
                          <span className="text-sm font-medium text-gray-900">{cat.name?.en}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">FR</span>
                          <span className="text-sm text-gray-600">{cat.name?.fr}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">AR</span>
                          <span className="text-sm text-gray-600">{cat.name?.ar}</span>
                        </div>
                      </div>
                    )}
                  </td>
                  
                  {/* Icon Column - Fixed */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editCatId === cat._id ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t("category.icon") || "Icon"}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => setEditCat({
                            ...editCat,
                            iconFile: e.target.files[0]
                          })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                        />
                        <div className="flex justify-center mt-2">
                          {editCat.iconFile ? (
                            <img 
                              src={URL.createObjectURL(editCat.iconFile)} 
                              alt="Preview" 
                              className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200" 
                            />
                          ) : cat.icon ? (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${cat.icon}`} 
                              alt="Current" 
                              className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200" 
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Icon</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        {cat.icon ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${cat.icon}`} 
                            alt="Category icon" 
                            className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200" 
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Icon</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  {/* Subcategories Column */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {subcategories
                        .filter(sub => Array.isArray(cat.subCategory) && cat.subCategory.includes(sub._id))
                        .map(sub =>
                          editSubId === sub._id ? (
                            <div key={sub._id} className="bg-gray-50 p-3 rounded-lg border">
                              <div className="grid grid-cols-1 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">EN</label>
                                  <input
                                    type="text"
                                    value={editSub.en}
                                    onChange={e => setEditSub({ ...editSub, en: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t("category.nameEn") || "English"}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">FR</label>
                                  <input
                                    type="text"
                                    value={editSub.fr}
                                    onChange={e => setEditSub({ ...editSub, fr: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t("category.nameFr") || "French"}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">AR</label>
                                  <input
                                    type="text"
                                    value={editSub.ar}
                                    onChange={e => setEditSub({ ...editSub, ar: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t("category.nameAr") || "Arabic"}
                                    required
                                  />
                                </div>
                                <div className="flex space-x-2 pt-2">
                                  <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                                    onClick={() => handleEditSubCategory(sub._id)}
                                  >
                                    {t("booking.save") || "Save"}
                                  </button>
                                  <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                                    onClick={() => setEditSubId(null)}
                                  >
                                    {t("booking.cancel") || "Cancel"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div key={sub._id} className="bg-gray-50 p-3 rounded-lg border hover:bg-gray-100 transition-colors duration-150">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">EN</span>
                                  <span className="text-sm text-gray-900">{sub.name?.en}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">FR</span>
                                  <span className="text-sm text-gray-600">{sub.name?.fr}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">AR</span>
                                  <span className="text-sm text-gray-600">{sub.name?.ar}</span>
                                </div>
                              </div>
                              <button
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                                onClick={() => {
                                  setEditSubId(sub._id);
                                  setEditSub({
                                    en: sub.name?.en || "",
                                    fr: sub.name?.fr || "",
                                    ar: sub.name?.ar || "",
                                  });
                                }}
                              >
                                {t("booking.save") || "Edit"}
                              </button>
                            </div>
                          )
                        )}
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editCatId === cat._id ? (
                      <div className="flex flex-col space-y-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => handleEditCategory(cat._id)}
                        >
                          {t("booking.save") || "Save"}
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => setEditCatId(null)}
                        >
                          {t("booking.cancel") || "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                          setEditCatId(cat._id);
                          setEditCat({
                            en: cat.name?.en || "",
                            fr: cat.name?.fr || "",
                            ar: cat.name?.ar || "",
                            iconFile: null
                          });
                        }}
                      >
                        {t("booking.save") || "Edit"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};

export default VendorCategories;