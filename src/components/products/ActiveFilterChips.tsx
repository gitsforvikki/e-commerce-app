"use client";

import { X } from "lucide-react";
import { FilterState } from "./ProductFiltersSidebar";
import { formatInr } from "@/services/order/pricing.service";

interface ActiveFilterChipsProps {
  filters: FilterState;
  onRemoveCategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onRemovePrice: () => void;
  onRemoveSearch: () => void;
  onRemoveInStock: () => void;
  onResetAll: () => void;
  minPossiblePrice: number;
  maxPossiblePrice: number;
}

export const ActiveFilterChips = ({
  filters,
  onRemoveCategory,
  onRemoveBrand,
  onRemovePrice,
  onRemoveSearch,
  onRemoveInStock,
  onResetAll,
  minPossiblePrice,
  maxPossiblePrice,
}: ActiveFilterChipsProps) => {
  const hasCategoryFilter = filters.selectedCategory !== "ALL";
  const hasBrandFilter = filters.selectedBrands.length > 0;
  const hasPriceFilter =
    filters.priceRange[0] > minPossiblePrice ||
    filters.priceRange[1] < maxPossiblePrice;
  const hasSearchFilter = !!filters.searchQuery.trim();
  const hasInStockFilter = filters.inStockOnly;

  const hasAnyFilter =
    hasCategoryFilter ||
    hasBrandFilter ||
    hasPriceFilter ||
    hasSearchFilter ||
    hasInStockFilter;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/80 dark:border-violet-900/40 rounded-xl">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
        Active Filters:
      </span>

      {/* Category chip */}
      {hasCategoryFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-850 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg shadow-2xs">
          <span>Category:</span>
          <strong className="capitalize">{filters.selectedCategory.toLowerCase()}</strong>
          <button
            type="button"
            onClick={onRemoveCategory}
            className="hover:text-violet-900 dark:hover:text-violet-100 rounded p-0.5"
            aria-label="Remove category filter"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Brand chips */}
      {filters.selectedBrands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-850 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg shadow-2xs"
        >
          <span>Brand:</span>
          <strong>{brand}</strong>
          <button
            type="button"
            onClick={() => onRemoveBrand(brand)}
            className="hover:text-violet-900 dark:hover:text-violet-100 rounded p-0.5"
            aria-label={`Remove brand ${brand}`}
          >
            <X size={13} />
          </button>
        </span>
      ))}

      {/* Price filter chip */}
      {hasPriceFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-850 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg shadow-2xs">
          <span>Price:</span>
          <strong>
            {formatInr(filters.priceRange[0] * 100)} -{" "}
            {formatInr(filters.priceRange[1] * 100)}
          </strong>
          <button
            type="button"
            onClick={onRemovePrice}
            className="hover:text-violet-900 dark:hover:text-violet-100 rounded p-0.5"
            aria-label="Remove price filter"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Search query chip */}
      {hasSearchFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-850 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg shadow-2xs">
          <span>Search:</span>
          <strong>&ldquo;{filters.searchQuery}&rdquo;</strong>
          <button
            type="button"
            onClick={onRemoveSearch}
            className="hover:text-violet-900 dark:hover:text-violet-100 rounded p-0.5"
            aria-label="Remove search filter"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* In stock chip */}
      {hasInStockFilter && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-850 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg shadow-2xs">
          <strong>In Stock Only</strong>
          <button
            type="button"
            onClick={onRemoveInStock}
            className="hover:text-violet-900 dark:hover:text-violet-100 rounded p-0.5"
            aria-label="Remove in-stock filter"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Clear all link */}
      <button
        type="button"
        onClick={onResetAll}
        className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 hover:underline ml-auto"
      >
        Clear all filters
      </button>
    </div>
  );
};
