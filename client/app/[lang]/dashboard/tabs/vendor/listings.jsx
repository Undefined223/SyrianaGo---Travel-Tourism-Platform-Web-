"use client";
import { getVendorListings, createListing, updateListing, getAllListings } from "@/app/lib/https/listing.https";
import React, { useEffect, useState, useRef } from "react";
import LocationFinder from "@/app/components/LocationFinder";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getAllSubCategories } from "@/app/lib/https/subcat.https";

const initialForm = {
  name: { en: "", fr: "", ar: "" },
  description: { en: "", fr: "", ar: "" },
  images: [],
  location: { city: "", coordinates: { lat: "", lng: "" } },
  contact: { phone: "", email: "", website: "" },
  cta: { label: "", url: "" },
  isFeatured: false,
  subcategory: "",
};

const VendorListings = () => {
  const { t, language } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const locationBtnRef = useRef();
  const locationPopupRef = useRef();
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        locationPopupRef.current &&
        !locationPopupRef.current.contains(event.target) &&
        !locationBtnRef.current.contains(event.target)
      ) {
        setShowLocationPopup(false);
      }
    }
    if (showLocationPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLocationPopup]);

  const handleMapLocationSelect = (addressObj) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: addressObj.city || "",
        coordinates: {
          lat: addressObj.lat || "",
          lng: addressObj.lng || "",
        },
      },
    }));
    setShowLocationPopup(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);
  const fetchSubcategories = async () => {
    setSubcategoriesLoading(true);
    try {
      const response = await getAllSubCategories();
      setSubcategories(response);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };
  useEffect(() => {
    if (showForm) {
      fetchSubcategories();
    }
  }, [showForm]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await getVendorListings();
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (field, value, lang) => {
    if (["name", "description"].includes(field) && lang) {
      setForm((prev) => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value },
      }));
    } else if (field === "location") {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, ...value },
      }));
    } else if (field === "coordinates") {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: { ...prev.location.coordinates, ...value },
        },
      }));
    } else if (field === "contact" || field === "cta") {
      setForm((prev) => ({
        ...prev,
        [field]: { ...prev[field], ...value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const openCreate = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (listing) => {
    setForm({
      ...listing,
      name: { ...listing.name },
      description: { ...listing.description },
      location: { ...listing.location },
      contact: { ...listing.contact },
      cta: { ...listing.cta },
      images: listing.images || [],
    });
    setEditId(listing._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", JSON.stringify(form.name));
    formData.append("description", JSON.stringify(form.description));
    formData.append("location", JSON.stringify(form.location));
    formData.append("contact", JSON.stringify(form.contact));
    formData.append("cta", JSON.stringify(form.cta));
    formData.append("isFeatured", form.isFeatured);
    formData.append("subcategory", form.subcategory);

    if (fileInputRef.current?.files?.length) {
      Array.from(fileInputRef.current.files).forEach((file) =>
        formData.append("images", file)
      );
    }

    try {
      if (editId) {
        await updateListing(editId, formData);
      } else {
        await createListing(formData);
      }
      setShowForm(false);
      fetchListings();
    } catch (err) {
      alert(t("listings.saveError") + ": " + (err.message || err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 font-medium">{t("listings.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("listings.title")}</h1>
              <p className="text-slate-600">{t("listings.subtitle")}</p>
            </div>
            <button
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={openCreate}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("listings.create")}
            </button>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-indigo-900/20 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {editId ? t("listings.edit") : t("listings.create")}
                </h3>
                <button
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors"
                  onClick={() => setShowForm(false)}
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Multilingual Name */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t("listings.name")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.english")}</label>
                      <input
                        type="text"
                        value={form.name.en}
                        onChange={(e) => handleInput("name", e.target.value, "en")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t("listings.nameEn")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.french")}</label>
                      <input
                        type="text"
                        value={form.name.fr}
                        onChange={(e) => handleInput("name", e.target.value, "fr")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t("listings.nameFr")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.arabic")}</label>
                      <input
                        type="text"
                        value={form.name.ar}
                        onChange={(e) => handleInput("name", e.target.value, "ar")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t("listings.nameAr")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Multilingual Description */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    {t("listings.description")}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.english")}</label>
                      <textarea
                        value={form.description.en}
                        onChange={(e) => handleInput("description", e.target.value, "en")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={3}
                        placeholder={t("listings.descEn")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.french")}</label>
                      <textarea
                        value={form.description.fr}
                        onChange={(e) => handleInput("description", e.target.value, "fr")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={3}
                        placeholder={t("listings.descFr")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("common.arabic")}</label>
                      <textarea
                        value={form.description.ar}
                        onChange={(e) => handleInput("description", e.target.value, "ar")}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={3}
                        placeholder={t("listings.descAr")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-slate-50 rounded-xl p-4 relative">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t("listings.location")}
                  </h4>
                  <div className="mb-4 relative">
                    <button
                      type="button"
                      ref={locationBtnRef}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      onClick={() => setShowLocationPopup((v) => !v)}
                    >
                      {t("listings.pickOnMap")}
                    </button>
                    {showLocationPopup && (
                      <div
                        ref={locationPopupRef}
                        className="absolute z-50 left-0 mt-2 w-[350px] sm:w-[400px] bg-white border border-slate-200 rounded-xl shadow-xl p-3"
                        style={{ top: "100%" }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-slate-800">{t("listings.selectLocation")}</span>
                          <button
                            className="text-slate-400 hover:text-slate-700 text-lg"
                            onClick={() => setShowLocationPopup(false)}
                            type="button"
                          >
                            ×
                          </button>
                        </div>
                        <div className="h-64 w-full">
                          <LocationFinder
                            onLocationSelect={handleMapLocationSelect}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.city")}</label>
                      <input
                        type="text"
                        value={form.location.city}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            location: { ...prev.location, city: e.target.value },
                          }))
                        }
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t("listings.city")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.latitude")}</label>
                      <input
                        type="number"
                        value={form.location.coordinates.lat}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              coordinates: { ...prev.location.coordinates, lat: e.target.value },
                            },
                          }))
                        }
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        step="any"
                        placeholder="33.4572"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.longitude")}</label>
                      <input
                        type="number"
                        value={form.location.coordinates.lng}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              coordinates: { ...prev.location.coordinates, lng: e.target.value },
                            },
                          }))
                        }
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        step="any"
                        placeholder="9.0221"
                      />
                    </div>
                  </div>
                </div>
                {/* Contact */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t("listings.contact")}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.email")}</label>
                      <input
                        type="email"
                        value={form.contact.email}
                        onChange={(e) => handleInput("contact", { email: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.phone")}</label>
                      <input
                        type="text"
                        value={form.contact.phone}
                        onChange={(e) => handleInput("contact", { phone: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.website")}</label>
                      <input
                        type="text"
                        value={form.contact.website}
                        onChange={(e) => handleInput("contact", { website: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA & Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">{t("listings.cta")}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.ctaLabel")}</label>
                        <input
                          type="text"
                          value={form.cta.label}
                          onChange={(e) => handleInput("cta", { label: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t("listings.ctaLabel")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t("listings.ctaUrl")}</label>
                        <input
                          type="text"
                          value={form.cta.url}
                          onChange={(e) => handleInput("cta", { url: e.target.value })}
                          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t("listings.ctaUrl")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-3">{t("listings.additionalSettings")}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SubCategory</label>
                        <select
                          value={form.subcategory}
                          onChange={(e) => handleInput("subcategory", e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          disabled={subcategoriesLoading}
                        >
                          <option value="">{t("listings.selectSubcategory")}</option>
                          {subcategoriesLoading ? (
                            <option disabled>{t("listings.loading")}...</option>
                          ) : (
                            subcategories.map((subcat) => (
                              <option key={subcat._id} value={subcat._id}>
                                {subcat?.name[language]} {/* Show English name */}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={form.isFeatured}
                          onChange={(e) => handleInput("isFeatured", e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm font-medium text-slate-700">
                          {t("listings.featured")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t("listings.images")}
                  </h4>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    accept="image/*"
                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {form.images && form.images.length > 0 && (
                    <div className="flex gap-3 mt-4 flex-wrap">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${img}`}
                            alt=""
                            className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {editId ? t("listings.save") : t("listings.create")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{t("listings.emptyTitle")}</h3>
            <p className="text-slate-600 mb-6">{t("listings.emptyDesc")}</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("listings.createFirst")}
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings?.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Images */}
                {listing.images && listing.images.length > 0 && (
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={`${process.env.NEXT_PUBLIC_NO_API_URL}uploads/${listing.images[0]}`}
                      alt={listing.name?.en || t("listings.imageAlt")}
                      className="w-full h-full object-cover"
                    />
                    {listing.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {t("listings.featured")}
                        </span>
                      </div>
                    )}
                    {listing.images.length > 1 && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
                          +{listing.images.length - 1}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {listing.name?.en}
                    </h3>
                    <div className="text-sm text-slate-500 space-x-2">
                      <span>{listing.name?.fr}</span>
                      <span>•</span>
                      <span>{listing.name?.ar}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-700 mb-4 line-clamp-3">
                    {listing.description?.en}
                  </p>

                  {/* Location */}
                  <div className="flex items-center mb-4 text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{listing.location?.city || t("listings.noLocation")}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {listing.contact?.email && (
                      <div className="flex items-center text-sm text-slate-600">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{listing.contact.email}</span>
                      </div>
                    )}
                    {listing.contact?.phone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{listing.contact.phone}</span>
                      </div>
                    )}
                    {listing.contact?.website && (
                      <div className="flex items-center text-sm text-slate-600">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <a
                          href={listing.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {t("listings.visitWebsite")}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {listing.cta?.url && (
                    <div className="mb-4">
                      <a
                        href={listing.cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {listing.cta.label || t("listings.learnMore")}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="font-medium text-slate-700">{t("listings.category")}:</span>
                        <br />
                        <span>{listing.subcategory || t("listings.noCategory")}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">ID:</span>
                        <br />
                        <span className="font-mono">{listing._id.slice(-8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-slate-500 mb-4 space-y-1">
                    <div>
                      <span className="font-medium">{t("listings.created")}:</span> {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">{t("listings.updated")}:</span> {new Date(listing.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => openEdit(listing)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {t("listings.edit")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorListings;