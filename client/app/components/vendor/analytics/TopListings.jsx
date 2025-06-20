const TopListings = ({ listings }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Top Performing Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing, idx) => (
          <div key={idx} className="bg-gradient-to-br from-white to-slate-50 rounded-xl border p-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">#{idx + 1}</div>
              <h4 className="text-lg font-semibold">{listing.name}</h4>
              <p className="text-slate-500">{listing.city}</p>
              <p className="mt-2 text-slate-800 font-bold text-xl">{listing.count} bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopListings;
