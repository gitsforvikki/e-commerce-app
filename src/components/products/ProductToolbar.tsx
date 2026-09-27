"use client";

import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";

export type ViewMode = "grid" | "list";

interface ProductToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalProducts: number;
  filteredCount: number;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categories: { name: string; count: number }[];
}

export const ProductToolbar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProducts,
  filteredCount,
  activeFilterCount,
  onOpenMobileFilters,
  selectedCategory,
  onCategorySelect,
  categories,
}: ProductToolbarProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Search input & Mobile Filter button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with live clear */}
        <div className="relative flex-1 max-w-lg">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, brand, or keyword..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 shadow-xs transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right side controls: Mobile Filter button + Sort + View Mode */}
        <div className="flex items-center gap-2.5 justify-between sm:justify-end">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <SlidersHorizontal size={16} className="text-violet-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-violet-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown size={15} className="text-slate-400 hidden sm:block" />
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-violet-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-violet-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Second row: Quick Category Pills & Count Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Category Pills Strip */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onCategorySelect(cat.name)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="capitalize">
                  {cat.name === "ALL" ? "All" : cat.name.toLowerCase()}
                </span>
                <span
                  className={`ml-1.5 text-[11px] font-normal ${
                    isActive ? "text-violet-200" : "text-slate-400"
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredCount}</span>{" "}
          of <span className="font-bold text-slate-800">{totalProducts}</span> products
        </div>
      </div>
    </div>
  );
};
