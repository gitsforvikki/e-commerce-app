export default function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse max-w-7xl mx-auto">
      {/* LEFT: Image Section */}
      <div>
        {/* Main Image */}
        <div className="w-full h-105 bg-gray-200 rounded-xl mb-4" />

        {/* Thumbnails */}
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div className="space-y-6">
        {/* Title */}
        <div className="h-8 w-3/4 bg-gray-200 rounded" />

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>

        {/* Price */}
        <div className="flex items-end gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>

        {/* Category & SKU */}
        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Quantity + Wishlist */}
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-gray-200 rounded-lg" />
          <div className="h-12 flex-1 bg-gray-200 rounded-lg" />
        </div>

        {/* Add to Cart */}
        <div className="h-14 w-full bg-gray-300 rounded-xl" />

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
