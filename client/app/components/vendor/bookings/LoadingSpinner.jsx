const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-slate-600 font-medium">Loading dashboard...</span>
      </div>
    </div>
  </div>
);
export default LoadingSpinner;
