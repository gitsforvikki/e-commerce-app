"use client";

import { useMemo, useState } from "react";
import {
  RotateCcw,
  Search,
  SlidersHorizontal,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatInr } from "@/services/order/pricing.service";

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // "ALL" or category name
  selectedBrands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

interface ProductFiltersSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableCategories: { name: string; count: number }[];
  availableBrands: { name: string; count: number }[];
  minPossiblePrice: number;
  maxPossiblePrice: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  activeFilterCount: number;
}

const PRICE_PRESETS = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹3,500", min: 2000, max: 3500 },
  { label: "Above ₹3,500", min: 3500, max: Infinity },
];

export const ProductFiltersSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableCategories,
  availableBrands,
  minPossiblePrice,
  maxPossiblePrice,
  isMobileDrawer = false,
  onCloseMobileDrawer,
  activeFilterCount,
}: ProductFiltersSidebarProps) => {
  const [brandSearch, setBrandSearch] = useState("");
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter brands based on inline search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return availableBrands;
    return availableBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase().trim()),
    );
  }, [availableBrands, brandSearch]);

  const handleCategorySelect = (categoryName: string) => {
    onFilterChange({
      ...filters,
      selectedCategory: categoryName,
    });
  };

  const handleBrandToggle = (brandName: string) => {
    const isSelected = filters.selectedBrands.includes(brandName);
    const updated = isSelected
      ? filters.selectedBrands.filter((b) => b !== brandName)
      : [...filters.selectedBrands, brandName];

    onFilterChange({
      ...filters,
      selectedBrands: updated,
    });
  };

  const handlePricePreset = (min: number, max: number) => {
    const safeMax = max === Infinity ? maxPossiblePrice : max;
    onFilterChange({
      ...filters,
      priceRange: [min, safeMax],
    });
  };

  const handleMinPriceChange = (value: number) => {
    const safeVal = Math.max(0, isNaN(value) ? 0 : value);
    onFilterChange({
      ...filters,
      priceRange: [safeVal, Math.max(safeVal, filters.priceRange[1])],
    });
  };

  const handleMaxPriceChange = (value: number) => {
    const safeVal = Math.max(filters.priceRange[0], isNaN(value) ? maxPossiblePrice : value);
    onFilterChange({
      ...filters,
      priceRange: [filters.priceRange[0], safeVal],
    });
  };

  return (
    <aside className="w-full space-y-6">
      {/* Header with Title and Clear Action */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-violet-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category Section */}
      <div className="border-b border-slate-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-sm font-bold text-slate-900 mb-3 group"
        >
          <span>Category</span>
          {openSections.category ? (
            <ChevronUp size={16} className="text-slate-400 group-hover:text-slate-600" />
          ) : (
            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
          )}
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-1">
            {availableCategories.map((cat) => {
              const isSelected = filters.selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-left ${
                    isSelected
                      ? "bg-violet-600 text-white font-semibold shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="capitalize">
                    {cat.name === "ALL" ? "All Categories" : cat.name.toLowerCase()}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Range Section */}
      <div className="border-b border-slate-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-sm font-bold text-slate-900 mb-3 group"
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp size={16} className="text-slate-400 group-hover:text-slate-600" />
          ) : (
            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-4 pt-1">
            {/* Quick Price Bracket Chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map((preset) => {
                const isActive =
                  preset.min === filters.priceRange[0] &&
                  (preset.max === Infinity
                    ? filters.priceRange[1] >= maxPossiblePrice
                    : filters.priceRange[1] === preset.max);

                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePricePreset(preset.min, preset.max)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                      isActive
                        ? "bg-violet-50 border-violet-500 text-violet-700 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Range Slider for Scrubbing Max Price */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{formatInr(minPossiblePrice * 100)}</span>
                <span className="font-semibold text-violet-700">
                  Up to {formatInr(filters.priceRange[1] * 100)}
                </span>
                <span>{formatInr(maxPossiblePrice * 100)}</span>
              </div>
              <input
                type="range"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                step={50}
                value={filters.priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Min and Max Number Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Min (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={filters.priceRange[0]}
                  onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Max (₹)
                </label>
                <input
                  type="number"
                  min={filters.priceRange[0]}
                  value={filters.priceRange[1]}
                  onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Brands Section */}
      <div className="border-b border-slate-100 pb-5">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between text-sm font-bold text-slate-900 mb-3 group"
        >
          <span>Brands</span>
          {openSections.brand ? (
            <ChevronUp size={16} className="text-slate-400 group-hover:text-slate-600" />
          ) : (
            <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
          )}
        </button>

        {openSections.brand && (
          <div className="space-y-3 pt-1">
            {/* Brand Search if more than 5 brands */}
            {availableBrands.length > 5 && (
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:border-violet-500 outline-none transition"
                />
              </div>
            )}

            {/* Brand Checkboxes */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredBrands.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No matching brands found</p>
              ) : (
                filteredBrands.map((brand) => {
                  const isChecked = filters.selectedBrands.includes(brand.name);
                  return (
                    <label
                      key={brand.name}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-violet-600 border-violet-600 text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                        >
                          {isChecked && <Check size={12} className="stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                          {brand.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {brand.count}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Availability / Stock Section */}
      <div className="pb-2">
        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
          <div>
            <span className="text-sm font-semibold text-slate-800 block">
              In Stock Only
            </span>
            <span className="text-[11px] text-slate-500 block">
              Hide out of stock items
            </span>
          </div>

          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                inStockOnly: e.target.checked,
              })
            }
            className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Mobile Drawer Done Button */}
      {isMobileDrawer && (
        <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-100">
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>View Products</span>
          </button>
        </div>
      )}
    </aside>
  );
};
