"use client";
import { useEffect, useState } from "react";
import { BarChart2, Users, Home, Calendar, DollarSign, TrendingUp, Activity, Sparkles, Target, Globe } from "lucide-react";
import { getDashboardAnalytics } from "@/app/lib/https/admin.https";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardAnalytics()
      .then((data) => {
        setAnalytics(data.data || data);
        setLoading(false);
      })
      .catch(() => {
        setAnalytics(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative flex justify-center items-center min-h-[80vh]">
          <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-ping"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {t("common.loading")}
            </h3>
            <p className="text-slate-500 text-lg">{t("dashboard.preparingInsights")}</p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/10 to-orange-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-slate-400/10 to-gray-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative text-center py-32">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-white/30 max-w-md mx-auto">
            <div className="relative mb-8">
              <Activity className="w-20 h-20 text-slate-300 mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">
              {t("dashboard.noAnalytics")}
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t("dashboard.analyticsLoadError") || "Unable to load analytics data at this time. Please try refreshing the page."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxBookings = Math.max(...analytics.bookingsPerMonth.map(item => item.count));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-gradient-to-bl from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      <div className="relative max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="flex space-x-1">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" style={{animationDelay: '0.5s'}} />
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" style={{animationDelay: '1s'}} />
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5"></div>
            <div className="relative">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
                {t("dashboard.analytics")}
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {t("dashboard.analyticsSubtitle") || "Monitor your platform's performance with real-time insights and comprehensive metrics"}
              </p>
              <div className="mt-8 flex justify-center items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{t("dashboard.realtimeData") || "Real-time Data"}</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{t("dashboard.performanceTracking") || "Performance Tracking"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-2 sm:px-0">
          {/* Total Users Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/50 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5"></div>
            <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/25 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-md">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-semibold">+12%</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{analytics.totalUsers?.toLocaleString() ?? "--"}</div>
                <div className="text-blue-100 text-sm sm:text-base lg:text-lg font-semibold">{t("dashboard.totalUsers")}</div>
                <div className="text-xs sm:text-sm text-blue-200 bg-white/10 rounded-full px-2 sm:px-3 py-1 inline-block">
                  {t("dashboard.growthFromLastMonth") || "Growth from last month"}
                </div>
              </div>
            </div>
          </div>
          {/* Total Listings Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-500/30 hover:shadow-3xl hover:shadow-emerald-500/50 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5"></div>
            <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/25 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-md">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-semibold">+8%</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{analytics.totalListings?.toLocaleString() ?? "--"}</div>
                <div className="text-emerald-100 text-sm sm:text-base lg:text-lg font-semibold">{t("dashboard.totalListings")}</div>
                <div className="text-xs sm:text-sm text-emerald-200 bg-white/10 rounded-full px-2 sm:px-3 py-1 inline-block">
                  {t("dashboard.growthFromLastMonth") || "Growth from last month"}
                </div>
              </div>
            </div>
          </div>
          {/* Total Bookings Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-500/30 hover:shadow-3xl hover:shadow-amber-500/50 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5"></div>
            <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/25 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-md">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-semibold">+24%</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{analytics.totalBookings?.toLocaleString() ?? "--"}</div>
                <div className="text-amber-100 text-sm sm:text-base lg:text-lg font-semibold">{t("dashboard.totalBookings")}</div>
                <div className="text-xs sm:text-sm text-amber-200 bg-white/10 rounded-full px-2 sm:px-3 py-1 inline-block">
                  {t("dashboard.growthFromLastMonth") || "Growth from last month"}
                </div>
              </div>
            </div>
          </div>
          {/* Total Revenue Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/30 hover:shadow-3xl hover:shadow-purple-500/50 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5"></div>
            <div className="absolute -top-6 sm:-top-10 -right-6 sm:-right-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative p-4 sm:p-6 lg:p-8 text-white">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/25 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-white/20 rounded-full px-2 sm:px-3 py-1 backdrop-blur-md">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-semibold">+18%</span>
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{analytics.totalRevenue ?? "--"}</div>
                <div className="text-purple-100 text-sm sm:text-base lg:text-lg font-semibold">{t("dashboard.revenue")}</div>
                <div className="text-xs sm:text-sm text-purple-200 bg-white/10 rounded-full px-2 sm:px-3 py-1 inline-block">
                  {t("dashboard.growthFromLastMonth") || "Growth from last month"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        {analytics.bookingsPerMonth && analytics.bookingsPerMonth.length > 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5"></div>
            <div className="relative bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-10 border-b border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                    <BarChart2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                      {t("dashboard.bookingsPerMonth")}
                    </h3>
                    <p className="text-slate-600 text-lg mt-1">
                      {t("dashboard.bookingsPerMonthDesc") || "Track your monthly booking trends and growth patterns"}
                    </p>
                  </div>
                </div>
                {analytics.bookingsPerMonth.length < 12 && (
                  <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-medium">
                    <span className="mr-2">⚠️</span>
                    {t("dashboard.limitedData")}
                  </div>
                )}
              </div>
            </div>
            <div className="relative p-10">
              <div className="flex items-end justify-center gap-6 h-80 bg-gradient-to-t from-slate-50/80 to-transparent rounded-2xl p-8 border border-white/20">
                {analytics.bookingsPerMonth.map((item, idx) => {
                  const height = (item.count / maxBookings) * 240;
                  const delay = idx * 150;
                  const getMonthName = (monthStr) => {
                    if (monthStr.includes('-')) {
                      const [year, month] = monthStr.split('-');
                      const monthNames = [
                        t("common.months.jan") || "Jan", t("common.months.feb") || "Feb", t("common.months.mar") || "Mar",
                        t("common.months.apr") || "Apr", t("common.months.may") || "May", t("common.months.jun") || "Jun",
                        t("common.months.jul") || "Jul", t("common.months.aug") || "Aug", t("common.months.sep") || "Sep",
                        t("common.months.oct") || "Oct", t("common.months.nov") || "Nov", t("common.months.dec") || "Dec"
                      ];
                      return monthNames[parseInt(month) - 1] || month;
                    }
                    return monthStr;
                  };
                  const displayMonth = getMonthName(item.month);
                  return (
                    <div key={item.month} className="flex flex-col items-center group cursor-pointer">
                      <div className="relative mb-4">
                        <div
                          className="w-20 bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 rounded-t-2xl shadow-2xl transition-all duration-700 hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-500 hover:shadow-3xl group-hover:scale-110 relative overflow-hidden"
                          style={{
                            height: `${Math.max(height, 20)}px`,
                            animationDelay: `${delay}ms`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/30"></div>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-80"></div>
                        </div>
                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-white/10 z-10">
                          <div className="font-bold text-lg">{item.count}</div>
                          <div className="text-slate-300 text-xs">{t("dashboard.bookingsInMonth", { month: displayMonth }) || `bookings in ${displayMonth}`}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                      <div className="text-center transition-all duration-300 group-hover:scale-110">
                        <div className="text-2xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors mb-1">
                          {item.count}
                        </div>
                        <div className="text-lg font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                          {displayMonth}
                        </div>
                        <div className="text-sm text-slate-400 font-medium">2025</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-indigo-600 font-bold text-lg mb-2">{t("dashboard.peakMonth") || "Peak Month"}</div>
                  <div className="text-2xl font-bold text-indigo-800">{maxBookings}</div>
                  <div className="text-sm text-indigo-600 mt-1">{t("dashboard.bookings") || "bookings"}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-purple-600 font-bold text-lg mb-2">{t("dashboard.average") || "Average"}</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {Math.round(analytics.bookingsPerMonth.reduce((sum, item) => sum + item.count, 0) / analytics.bookingsPerMonth.length)}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">{t("dashboard.bookings") || "bookings"}</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 text-center shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-cyan-600 font-bold text-lg mb-2">{t("dashboard.totalPeriod") || "Total Period"}</div>
                  <div className="text-2xl font-bold text-cyan-800">
                    {analytics.bookingsPerMonth.reduce((sum, item) => sum + item.count, 0)}
                  </div>
                  <div className="text-sm text-cyan-600 mt-1">{t("dashboard.bookings") || "bookings"}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-emerald-600 font-bold text-lg mb-2">{t("dashboard.dataPoints") || "Data Points"}</div>
                  <div className="text-2xl font-bold text-emerald-800">{analytics.bookingsPerMonth.length}</div>
                  <div className="text-sm text-emerald-600 mt-1">{t("dashboard.months") || "months"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}