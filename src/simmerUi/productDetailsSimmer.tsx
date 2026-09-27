export default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 animate-pulse items-start">
          {/* LEFT: Image Section */}
          <div>
            <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-6">
            {/* Badges & Title */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>

            {/* Specs box */}
            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>

            {/* Quantity + Wishlist */}
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>

            {/* Add to Cart CTA */}
            <div className="h-14 w-full bg-slate-300 dark:bg-slate-800 rounded-xl" />

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl" />
              <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
