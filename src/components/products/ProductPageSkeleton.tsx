export const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-16 transition-colors">
      {/* Top Hero Banner Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-850 rounded-md" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-pulse">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                ))}
              </div>
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md pt-4" />
              <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md pt-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Products Area Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between animate-pulse">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full sm:w-80" />
              <div className="flex gap-2">
                <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-10 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
