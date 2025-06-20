"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getAllCategories } from "@/app/lib/https/cat.https";
import { useRouter } from "next/navigation";

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const { language, t, isLoading: langLoading } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading || langLoading) {
        return (
            <section className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-700">{t("loading")}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="categories" className="min-h-screen px-6 py-20 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-150">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-700 mb-3">
                        {t("nav.categories")}
                    </h2>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto"></div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {categories?.map((cat, index) => (
                        <div
                            key={cat._id}
                            className="group relative overflow-hidden cursor-pointer"
                            onClick={() => router.push(`/${language}/category/${cat._id}`)}
                        >
                            {/* Main Card */}
                            <div className="relative bg-gray-50/95 backdrop-blur-xl rounded-2xl p-8 text-center shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-gray-300 hover:border-blue-400">
                                
                                {/* Animated Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-100/20 to-purple-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                
                                {/* Floating Particles Effect */}
                                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse"></div>
                                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200/15 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-150 group-hover:animate-pulse"></div>
                                </div>

                                {/* Icon Container */}
                                <div className="relative z-10 mb-6">
                                    <div className="relative w-24 h-24 mx-auto">
                                        {/* Outer Ring */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-200/40 to-gray-300/40 group-hover:from-blue-200/50 group-hover:to-indigo-200/50 transition-all duration-500"></div>
                                        
                                        {/* Middle Ring */}
                                        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-500 shadow-sm"></div>
                                        
                                        {/* Icon Container */}
                                        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                            <img
                                                src={`http://localhost:5000/uploads/${cat.icon}`}
                                                alt={cat.name[language] || cat.name.en}
                                                width={80}
                                                height={80}
                                                unoptimized="true"
                                                className="w-12 h-12 object-contain transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                                            />
                                        </div>

                                        {/* Rotating Border */}
                                        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-300/40 via-indigo-300/40 to-purple-300/40 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500" style={{animationDuration: '3s'}}></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 space-y-3">
                                    <h3 className="text-xl font-bold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 leading-tight">
                                        {cat.name[language] || cat.name.en}
                                    </h3>
                                    
                                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto group-hover:via-blue-500 transition-colors duration-300"></div>
                                    
                                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                                        {cat.slug[language] || cat.slug.en}
                                    </p>
                                </div>

                                {/* Bottom Accent - Syria Revolution Flag Colors */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-white to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-b-2xl"></div>
                                
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                            </div>

                            {/* Shadow Enhancement */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-2xl blur-xl transform scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;