"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductType } from "@/type";
import { routes } from "@/utils/routes";
import {
  ProductFiltersSidebar,
  FilterState,
} from "./ProductFiltersSidebar";
import {
  ProductToolbar,
  SortOption,
  ViewMode,
} from "./ProductToolbar";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { ProductCardPro } from "./ProductCardPro";
import {
  ChevronRight,
  PackageOpen,
  RotateCcw,
  X,
  CheckCircle2,
  ShoppingCart,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

interface ProductsPageClientProps {
  initialProducts: ProductType[];
}

const ITEMS_PER_PAGE = 12;

export const ProductsPageClient = ({
  initialProducts,
}: ProductsPageClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamic bounds from full dataset
  const { minPossiblePrice, maxPossiblePrice, allBrands, allCategories } =
    useMemo(() => {
      if (initialProducts.length === 0) {
        return {
          minPossiblePrice: 0,
          maxPossiblePrice: 5000,
          allBrands: [],
          allCategories: [],
        };
      }

      let min = Infinity;
      let max = -Infinity;
      const brandCounts: Record<string, number> = {};
      const catCounts: Record<string, number> = {};

      for (const p of initialProducts) {
        if (p.price < min) min = p.price;
        if (p.price > max) max = p.price;

        if (p.brand) {
          brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
        }
        if (p.category) {
          catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        }
      }

      const brandsList = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));

      const categoriesList = [
        { name: "ALL", count: initialProducts.length },
        ...Object.entries(catCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      ];

      return {
        minPossiblePrice: Math.floor(min),
        maxPossiblePrice: Math.ceil(max),
        allBrands: brandsList,
        allCategories: categoriesList,
      };
    }, [initialProducts]);

  // Initial state derived from URL query parameters
  const initialCategoryParam = searchParams.get("category")?.toUpperCase() || "ALL";
  const initialSearchParam = searchParams.get("search") || "";
  const initialSortParam = (searchParams.get("sort") as SortOption) || "featured";

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearchParam,
    selectedCategory: initialCategoryParam,
    selectedBrands: [],
    priceRange: [0, maxPossiblePrice || 5000],
    inStockOnly: false,
  });

  const [sortBy, setSortBy] = useState<SortOption>(initialSortParam);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    name: string;
  } | null>(null);

  // Sync state when URL params change externally
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        selectedCategory: categoryParam.toUpperCase(),
      }));
    }
  }, [searchParams]);

  // Keep URL parameters synced cleanly without reloading
  const updateUrlParams = useCallback(
    (newFilters: FilterState, newSort: SortOption) => {
      const params = new URLSearchParams();

      if (newFilters.selectedCategory && newFilters.selectedCategory !== "ALL") {
        params.set("category", newFilters.selectedCategory.toLowerCase());
      }
      if (newFilters.searchQuery.trim()) {
        params.set("search", newFilters.searchQuery.trim());
      }
      if (newSort && newSort !== "featured") {
        params.set("sort", newSort);
      }
      if (newFilters.selectedBrands.length > 0) {
        params.set("brand", newFilters.selectedBrands.join(","));
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${routes.PRODUCTS}?${queryString}` : routes.PRODUCTS;
      window.history.replaceState(null, "", newUrl);
    },
    [],
  );

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateUrlParams(newFilters, sortBy);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateUrlParams(filters, newSort);
  };

  const handleResetFilters = () => {
    const reset: FilterState = {
      searchQuery: "",
      selectedCategory: "ALL",
      selectedBrands: [],
      priceRange: [0, maxPossiblePrice],
      inStockOnly: false,
    };
    setFilters(reset);
    setSortBy("featured");
    setCurrentPage(1);
    updateUrlParams(reset, "featured");
  };

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.selectedCategory !== "ALL") count++;
    if (filters.selectedBrands.length > 0) count += filters.selectedBrands.length;
    if (
      filters.priceRange[0] > minPossiblePrice ||
      filters.priceRange[1] < maxPossiblePrice
    ) {
      count++;
    }
    if (filters.searchQuery.trim()) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters, minPossiblePrice, maxPossiblePrice]);

  // Main Filtering Engine
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.usage?.toLowerCase().includes(query),
      );
    }

    // 2. Category
    if (filters.selectedCategory !== "ALL") {
      result = result.filter(
        (p) =>
          p.category?.toUpperCase() === filters.selectedCategory.toUpperCase(),
      );
    }

    // 3. Brands
    if (filters.selectedBrands.length > 0) {
      result = result.filter((p) =>
        filters.selectedBrands.includes(p.brand),
      );
    }

    // 4. Price Range
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    // 5. In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => Number(p.qty) > 0);
    }

    // 6. Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      case "featured":
      default:
        // natural order
        break;
    }

    return result;
  }, [initialProducts, filters, sortBy]);

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  // Toast trigger on add to cart
  const handleAddToCartToast = (productName: string) => {
    setToastNotification({
      show: true,
      name: productName,
    });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* ======================================================== */}
      {/* 1. HERO & BREADCRUMBS BANNER */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-500 mb-3"
          >
            <Link
              href={routes.HOME}
              className="hover:text-violet-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="font-semibold text-slate-800">Products</span>
            {filters.selectedCategory !== "ALL" && (
              <>
                <ChevronRight size={13} className="text-slate-400" />
                <span className="font-semibold text-violet-600 capitalize">
                  {filters.selectedCategory.toLowerCase()}
                </span>
              </>
            )}
          </nav>

          {/* Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-2">
                <Sparkles size={13} />
                <span>Curated Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {filters.selectedCategory === "ALL"
                  ? "Explore All Products"
                  : `${filters.selectedCategory} Collection`}
              </h1>
              <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
                Discover exceptional quality across top brands with flexible filters,
                instant search, secure checkout, and free fast shipping.
              </p>
            </div>

            {/* Total items badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <span>{initialProducts.length} Total Items Available</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <ProductFiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                availableCategories={allCategories}
                availableBrands={allBrands}
                minPossiblePrice={minPossiblePrice}
                maxPossiblePrice={maxPossiblePrice}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* PRODUCTS CONTENT COLUMN */}
          <main className="lg:col-span-3">
            {/* Top Toolbar */}
            <ProductToolbar
              searchQuery={filters.searchQuery}
              onSearchChange={(query) =>
                handleFilterChange({ ...filters, searchQuery: query })
              }
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalProducts={initialProducts.length}
              filteredCount={filteredProducts.length}
              activeFilterCount={activeFilterCount}
              onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
              selectedCategory={filters.selectedCategory}
              onCategorySelect={(cat) =>
                handleFilterChange({ ...filters, selectedCategory: cat })
              }
              categories={allCategories}
            />

            {/* Active Filters Bar */}
            <ActiveFilterChips
              filters={filters}
              onRemoveCategory={() =>
                handleFilterChange({ ...filters, selectedCategory: "ALL" })
              }
              onRemoveBrand={(brand) =>
                handleFilterChange({
                  ...filters,
                  selectedBrands: filters.selectedBrands.filter(
                    (b) => b !== brand,
                  ),
                })
              }
              onRemovePrice={() =>
                handleFilterChange({
                  ...filters,
                  priceRange: [minPossiblePrice, maxPossiblePrice],
                })
              }
              onRemoveSearch={() =>
                handleFilterChange({ ...filters, searchQuery: "" })
              }
              onRemoveInStock={() =>
                handleFilterChange({ ...filters, inStockOnly: false })
              }
              onResetAll={handleResetFilters}
              minPossiblePrice={minPossiblePrice}
              maxPossiblePrice={maxPossiblePrice}
            />

            {/* ======================================================== */}
            {/* ZERO RESULTS EMPTY STATE */}
            {/* ======================================================== */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center shadow-xs my-6">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4">
                  <PackageOpen size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No products matched your criteria
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn&apos;t find any items matching your current filters. Try
                  expanding your price range, clearing brand selections, or searching
                  with different keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white font-semibold text-sm shadow-sm transition"
                >
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <>
                {/* ======================================================== */}
                {/* PRODUCTS LIST / GRID */}
                {/* ======================================================== */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCardPro
                        key={product._id}
                        product={product}
                        viewMode="grid"
                        onAddToCartSuccess={handleAddToCartToast}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <ProductCardPro
                        key={product._id}
                        product={product}
                        viewMode="list"
                        onAddToCartSuccess={handleAddToCartToast}
                      />
                    ))}
                  </div>
                )}

                {/* ======================================================== */}
                {/* PAGINATION CONTROLS */}
                {/* ======================================================== */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing{" "}
                      <span className="font-bold text-slate-800">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-slate-800">
                        {Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredProducts.length,
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-800">
                        {filteredProducts.length}
                      </span>{" "}
                      results
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                              currentPage === page
                                ? "bg-violet-600 text-white shadow-xs"
                                : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
                        aria-label="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE FILTER SLIDE-OUT DRAWER */}
      {/* ======================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Filter Products
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <ProductFiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                availableCategories={allCategories}
                availableBrands={allBrands}
                minPossiblePrice={minPossiblePrice}
                maxPossiblePrice={maxPossiblePrice}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TOAST NOTIFICATION ON ADD TO CART */}
      {/* ======================================================== */}
      {toastNotification?.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400">
                  Added to Cart
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {toastNotification.name}
                </p>
              </div>
            </div>

            <Link
              href={routes.CART}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shrink-0 transition"
            >
              <ShoppingCart size={13} />
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
