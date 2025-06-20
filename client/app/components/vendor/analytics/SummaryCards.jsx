const SummaryCards = ({ stats }) => {
  const totalBookings = stats.reduce((sum, m) => sum + m.bookings, 0);
  const totalRevenue = stats.reduce((sum, m) => sum + m.revenue, 0);
  const avgBookings = totalBookings ? Math.round(totalBookings / 12) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Bookings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-slate-600 mb-1">Total Bookings</p>
        <p className="text-3xl font-bold text-slate-800">{totalBookings}</p>
      </div>
      {/* Card 2: Revenue */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
      </div>
      {/* Card 3: Average Bookings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-slate-600 mb-1">Avg. Monthly Bookings</p>
        <p className="text-3xl font-bold text-purple-600">{avgBookings}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
