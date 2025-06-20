export default function Skeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-neutral-700 rounded-xl shadow-md overflow-hidden">
      <div className="w-full h-48 bg-gray-300 dark:bg-neutral-600"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-300 dark:bg-neutral-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-neutral-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-neutral-600 rounded w-1/3"></div>
      </div>
    </div>
  );
}
