"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useUser } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useLanguage } from "@/app/contexts/LanguageContext";
import MessageBell from "@/app/components/dashboard/MessageBell";
import { toggle2FA } from "@/app/lib/https/auth.https";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const roleTabs = {
    admin: [
      { key: "overview", label: t("user.overview"), icon: "Home" },
      { key: "bookings", label: t("user.bookings"), icon: "Calendar" },
      { key: "reviews", label: t("dashboard.reviews"), icon: "Star" },
      { key: "listings", label: t("dashboard.listings"), icon: "Package" },
      { key: "analytics", label: t("dashboard.analytics"), icon: "BarChart3" },
      { key: "categories", label: t("dashboard.categories"), icon: "BarChart3" },
      { key: "user", label: t("user.user"), icon: "BarChart3" },
      { key: "settings", label: t("user.settings"), icon: "Settings" },
    ],
    vendor: [
      { key: "overview", label: t("user.overview"), icon: "Home" },
      { key: "bookings", label: t("user.bookings"), icon: "Calendar" },
      { key: "listings", label: t("dashboard.listings"), icon: "Package" },
      { key: "analytics", label: t("dashboard.analytics"), icon: "BarChart3" },
      { key: "categories", label: t("dashboard.categories"), icon: "BarChart3" },
      { key: "reviews", label: t("dashboard.reviews"), icon: "BarChart3" },
      { key: "settings", label: t("user.settings"), icon: "Settings" },
    ],
    user: [
      { key: "overview", label: t("user.overview"), icon: "Home" },
      { key: "bookings", label: t("user.bookings"), icon: "Calendar" },
      { key: "wishlist", label: t("user.wishlist"), icon: "Heart" },
      { key: "settings", label: t("user.settings"), icon: "Settings" },
    ],
  };

  // Map icon names to Lucide icons
  const iconMap = {
    Home: require('lucide-react').Home,
    Calendar: require('lucide-react').Calendar,
    CreditCard: require('lucide-react').CreditCard,
    Star: require('lucide-react').Star,
    Package: require('lucide-react').Package,
    BarChart3: require('lucide-react').BarChart3,
    Settings: require('lucide-react').Settings,
    Heart: require('lucide-react').Heart,
  };

  const role = user?.role || "user";
  const tabs = roleTabs[role] || roleTabs.user;
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "overview");

  const DynamicTab = useMemo(() => {
    return dynamic(
      () => {
        if (activeTab === "settings") {
          return import(`./tabs/settings`);
        }
        return import(`./tabs/${role}/${activeTab}`).catch(() =>
          import(`./tabs/user/overview`)
        );
      },
      {
        loading: () => <div className="flex justify-center p-8">{t("common.loading")}</div>,
        ssr: false
      }
    );
  }, [role, activeTab, t]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting tab
  };

  const roleColors = {
    user: 'bg-green-500',
    vendor: 'bg-blue-500',
    admin: 'bg-red-500'
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="text-xl font-bold text-gray-800">
              <a href="/" className="text-blue-500 font-medium">SyrianaGo</a>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <MessageBell />
            <div className={`w-8 h-8 ${roleColors[role]} rounded-full flex items-center justify-center cursor-pointer`}>
              <span className="text-white text-sm font-semibold">
                {getInitials(user?.name || 'User')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-sm border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:block
        `}>
          <div className="p-4 sm:p-6 flex flex-col h-full overflow-y-auto">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 mb-6 sm:mb-8">
              <div className={`w-10 h-10 ${roleColors[role]} rounded-full flex items-center justify-center text-white font-semibold`}>
                {getInitials(user?.name || 'User')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-800 truncate">{user?.name || t("user.profile")}</div>
                <div className="text-sm text-gray-500 capitalize">{t(`user.${role}`) || role}</div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6 space-y-2">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user?.email || t("login.emailPlaceholder")}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t("dashboard.menu")}
              </div>
            </div>

            <nav className="space-y-2 flex-1">
              {tabs.map((tab) => {
                const Icon = iconMap[tab.icon];
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.key
                      ? `${roleColors[role]} text-white`
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout button at bottom */}
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{t("auth.logout")}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 lg:ml-0">
          <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">
                {activeTab === 'overview'
                  ? t("dashboard.welcome", { name: user?.name || t("user.profile") })
                  : tabs.find(tab => tab.key === activeTab)?.label}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {activeTab === 'overview'
                  ? t("dashboard.summary")
                  : t("dashboard.manage", { tab: tabs.find(tab => tab.key === activeTab)?.label?.toLowerCase() })}
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* Primary Content Area */}
              <div className="xl:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-4 sm:p-6 min-h-96"
                  >
                    <DynamicTab />
                  </motion.div>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="text-center">
                    <div className={`w-12 sm:w-16 h-12 sm:h-16 ${roleColors[role]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white text-lg sm:text-xl font-bold">
                        {getInitials(user?.name || 'User')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{user?.name || t("user.profile")}</h3>
                    <p className="text-sm text-gray-600 capitalize">{t(`user.${role}`) || role}</p>
                  </div>
                </div>

                {/* Stats/Info Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h4 className="font-semibold mb-4 text-gray-800">{t("dashboard.quickInfo")}</h4>
                  <div className="space-y-3">
                    <div className="text-center text-gray-500 py-4">
                      <p className="text-sm">
                        {t("dashboard.roleStats", { role })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h4 className="font-semibold mb-4 text-gray-800">{t("dashboard.quickActions")}</h4>
                  <button
                    className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center sm:justify-start ${user?.twoFactorEnabled
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    onClick={async () => {
                      try {
                        await toggle2FA();
                        window.location.reload();
                      } catch (err) {
                        alert(t("user.2faError") + ": " + (err?.message || "Error"));
                      }
                    }}
                  >
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a6 6 0 1112 0z" />
                    </svg>
                    <span className="truncate">
                      {user?.twoFactorEnabled
                        ? t("user.disable2fa")
                        : t("user.enable2fa")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}