"use client";
import { useEffect, useState } from "react";
import { getVendorBookings } from "@/app/lib/https/booking.https";

// Simple chart using chart.js via react-chartjs-2
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getLast12Months() {
  const arr = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return arr;
}

const Analytics = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [topListings, setTopListings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getVendorBookings();
        setBookings(data);

        // --- Bookings and Revenue per Month ---
        const months = getLast12Months();
        const bookingsPerMonth = {};
        const revenuePerMonth = {};
        months.forEach((m) => {
          bookingsPerMonth[m] = 0;
          revenuePerMonth[m] = 0;
        });

        data.forEach((b) => {
          const m = getMonthYear(b.createdAt);
          if (months.includes(m)) {
            bookingsPerMonth[m]++;
            if (b.status === "confirmed") {
              revenuePerMonth[m] += Number(b.details?.price || 0);
            }
          }
        });

        setMonthlyStats(
          months.map((m) => ({
            month: m,
            bookings: bookingsPerMonth[m],
            revenue: revenuePerMonth[m],
          }))
        );

        // --- Top 3 Listings by Bookings ---
        const listingCounts = {};
        data.forEach((b) => {
          const id = b.listingId?._id;
          if (!id) return;
          if (!listingCounts[id]) {
            listingCounts[id] = {
              count: 0,
              name: b.listingId?.name?.en || "Unknown",
              city: b.listingId?.location?.city || "",
            };
          }
          listingCounts[id].count++;
        });
        const top = Object.values(listingCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setTopListings(top);
      } catch {
        setMonthlyStats([]);
        setTopListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-lg text-slate-600 font-medium">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chart data
  const labels = monthlyStats.map((m) => m.month);
  const bookingsData = monthlyStats.map((m) => m.bookings);
  const revenueData = monthlyStats.map((m) => m.revenue);

  // Calculate totals for summary cards
  const totalBookings = bookingsData.reduce((sum, val) => sum + val, 0);
  const totalRevenue = revenueData.reduce((sum, val) => sum + val, 0);
  const avgBookingsPerMonth = totalBookings ? Math.round(totalBookings / 12) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your booking performance and revenue insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-800">{totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Avg. Monthly Bookings</p>
                <p className="text-3xl font-bold text-purple-600">{avgBookingsPerMonth}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Bookings per Month */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Monthly Bookings</h3>
              <p className="text-sm text-slate-600">Booking trends over the last 12 months</p>
            </div>
            <div className="h-64">
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Bookings",
                      data: bookingsData,
                      backgroundColor: "rgba(59,130,246,0.8)",
                      borderRadius: 8,
                      borderSkipped: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      cornerRadius: 8,
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true, 
                      precision: 0,
                      grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(100, 116, 139, 0.8)',
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'rgba(100, 116, 139, 0.8)',
                      }
                    }
                  },
                }}
              />
            </div>
          </div>

          {/* Revenue per Month */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Monthly Revenue</h3>
              <p className="text-sm text-slate-600">Confirmed booking revenue trends</p>
            </div>
            <div className="h-64">
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Revenue ($)",
                      data: revenueData,
                      borderColor: "rgba(16,185,129,1)",
                      backgroundColor: "rgba(16,185,129,0.1)",
                      tension: 0.4,
                      fill: true,
                      pointRadius: 6,
                      pointBackgroundColor: "rgba(16,185,129,1)",
                      pointBorderColor: "white",
                      pointBorderWidth: 2,
                      pointHoverRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      titleColor: 'white',
                      bodyColor: 'white',
                      cornerRadius: 8,
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                      },
                      ticks: {
                        color: 'rgba(100, 116, 139, 0.8)',
                        callback: function(value) {
                          return '$' + value.toLocaleString();
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'rgba(100, 116, 139, 0.8)',
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Top 3 Listings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Top Performing Listings</h3>
            <p className="text-sm text-slate-600">Your most popular listings by booking count</p>
          </div>
          {topListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg">No bookings yet</p>
              <p className="text-slate-500 text-sm mt-1">Your top listings will appear here once you start receiving bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topListings.map((listing, idx) => (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-white ${
                      idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                      'bg-gradient-to-br from-amber-600 to-amber-800'
                    }`}>
                      #{idx + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">{listing.name}</h4>
                    <p className="text-slate-500 text-sm mb-4">{listing.city}</p>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold text-slate-800 mb-1">{listing.count}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">bookings</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;