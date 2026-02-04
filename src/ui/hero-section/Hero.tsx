import { Search } from "lucide-react";

export const HeroPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-radial-[circle_at_top] from-indigo-700 via-violet-600 to-indigo-700 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Your Next Favorite
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Shop from a curated collection of premium products at unbeatable
              prices
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto mt-8">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-lg px-4 py-3">
                <Search size={20} className="text-gray-700" />
                <input
                  type="text"
                  placeholder="Search products..."
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700 placeholder-gray-700 bg-transparent"
                />
              </div>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 text-sm sm:text-base">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">10K+</p>
                <p className="text-white/80">Products</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">50K+</p>
                <p className="text-white/80">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">24/7</p>
                <p className="text-white/80">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
