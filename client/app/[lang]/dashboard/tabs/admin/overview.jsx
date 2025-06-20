"use client";
import React, { useEffect, useState } from "react";
import { Users, CalendarCheck, Building, Clock, Layers, List, TrendingUp, Activity, Shield } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { getAdminOverviewStats, getBookingTrends } from "@/app/lib/https/admin.https";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#3b82f6", "#8b5cf6"];

export default function AdminOverview() {
  const { t } = useLanguage();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingTrends, setBookingTrends] = useState([]);

  useEffect(() => {
    getAdminOverviewStats()
      .then((data) => {
        setOverview(data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ " + t("common.loading"));
        setLoading(false);
      });

    getBookingTrends()
      .then((data) => setBookingTrends(data))
      .catch(() => setBookingTrends([]));
  }, [t]);

  const userTypesData = overview
    ? Object.entries(overview.users.types).map(([type, count]) => ({
        name: t(`user.${type}`),
        value: count,
      }))
    : [];

  const growthData = {
    users: overview?.userGrowth || 0,
    listings: overview?.listingGrowth || 0, 
    bookings: overview?.bookingGrowth || 0,
    revenue: overview?.revenueGrowth || 0
  };

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t("dashboard.welcome")}
            </h1>
          </div>
          <p className="text-gray-600">{t("dashboard.summary")}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PrimaryStatCard 
            icon={<Users className="w-7 h-7" />} 
            label={t("user.user")}
            value={overview?.users.total} 
            growth={growthData.users}
            loading={loading}
            gradient="from-blue-500 to-cyan-500"
          />
          <PrimaryStatCard 
            icon={<Building className="w-7 h-7" />} 
            label={t("dashboard.listings")}
            value={overview?.listings.total} 
            growth={growthData.listings}
            loading={loading}
            gradient="from-emerald-500 to-teal-500"
          />
          <PrimaryStatCard 
            icon={<CalendarCheck className="w-7 h-7" />} 
            label={t("dashboard.payments")}
            value={overview?.bookings.total} 
            growth={growthData.bookings}
            loading={loading}
            gradient="from-purple-500 to-pink-500"
          />
          <PrimaryStatCard 
            icon={<TrendingUp className="w-7 h-7" />} 
            label={t("dashboard.payments")}
            value={overview?.revenue || "N/A"} 
            growth={growthData.revenue}
            loading={loading}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <SecondaryStatCard 
            icon={<Layers className="w-5 h-5 text-indigo-600" />} 
            label={t("dashboard.categories")}
            value={overview?.categories} 
            loading={loading} 
          />
          <SecondaryStatCard 
            icon={<List className="w-5 h-5 text-purple-600" />} 
            label={t("common.subcategories")}
            value={overview?.subcategories} 
            loading={loading} 
          />
          <SecondaryStatCard 
            icon={<Shield className="w-5 h-5 text-blue-600" />} 
            label={t("booking.statusValues.pending")}
            value={overview?.bookings.pending} 
            loading={loading} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Trend Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t("dashboard.analytics")}</h2>
                  <p className="text-sm text-gray-600">{t("dashboard.summary")}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={bookingTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Types Pie Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t("user.user")}</h2>
                  <p className="text-sm text-gray-600">{t("dashboard.summary")}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={userTypesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                  >
                    {userTypesData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryStatCard({ icon, label, value, growth, loading, gradient }) {
  return (
    <div className="group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className={`p-3 bg-gradient-to-r ${gradient} rounded-xl text-white shadow-lg`}>
            {icon}
          </div>
          {growth && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <TrendingUp className="w-3 h-3" />
              {growth > 0 ? '+' : ''}{growth}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : (value ?? "—")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondaryStatCard({ icon, label, value, loading }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-gray-600 truncate">{label}</div>
          <div className="text-lg font-bold text-gray-900 mt-0.5">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-5 w-12 rounded"></div>
            ) : (
              typeof value === 'number' ? value.toLocaleString() : (value ?? "—")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}