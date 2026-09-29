"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, useRef } from "react";
import {
  UploadCloud,
  AlertCircle,
  Sparkles,
  Tag,
  DollarSign,
  Package,
  FileText,
  ArrowLeft,
  Check,
  Save,
} from "lucide-react";
import { editProduct, ProductFormState } from "@/server-actions/product.actions";
import { routes } from "@/utils/routes";
import { ProductType } from "@/type";

const initialState: ProductFormState = { success: false };

const CATEGORIES = [
  { id: "MEN", label: "Men's Collection", tag: "Fashion & Tech" },
  { id: "WOMEN", label: "Women's Collection", tag: "Designer & Luxury" },
  { id: "KIDS", label: "Kids & Youth", tag: "Apparel & Gear" },
];

/**
 * EditProductForm
 * ----------------
 * Pre-filled form for editing an existing product.
 * Uses the same `editProduct` server action (ADMIN-guarded).
 */
export function EditProductForm({ product }: { product: ProductType }) {
  // Pre-fill form fields from existing product
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState(String(product.price));
  const [qty, setQty] = useState(String(product.qty));
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [usage, setUsage] = useState(product.usage);

  // Image state — pre-fill with existing image
  const [imageUrl, setImageUrl] = useState(product.image);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(editProduct, initialState);

  // ── Image upload handler (same as UploadProductForm) ──────────

  async function handleImageUpload(file: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB");
      return;
    }

    setLoading(true);
    setUploadError("");
    setImageName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || typeof data.url !== "string") {
        throw new Error(data.message || "Image upload failed");
      }
      setImageUrl(data.url);
    } catch (error) {
      setImageUrl(product.image); // Fall back to original image
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageUpload(file);
  };

  // ── Input style constant ──────────────────────────────────────

  const inputClasses =
    "w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all";

  const iconInputClasses = `w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all`;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Catalog Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Edit Product
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Update product details, pricing, inventory, or replace the product
              image.
            </p>
          </div>

          <Link
            href={routes.PRODUCTS}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* ── Error Banner ── */}
        {state.error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="font-medium">{state.error}</div>
          </div>
        )}

        {/* ── Form ── */}
        <form action={action} className="space-y-6">
          {/* Hidden field: productId */}
          <input type="hidden" name="productId" value={product._id} />
          {/* Hidden field: image URL */}
          <input type="hidden" name="image" value={imageUrl} />

          {/* ── Section 1: General Information ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  General Information
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Product title, manufacturer brand, and category
                </p>
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Premium Wireless Headphones"
                className={inputClasses}
              />
              {state.errors?.name && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{state.errors.name[0]}</span>
                </p>
              )}
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="brand"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Brand <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Tag className="w-4 h-4" />
                  </div>
                  <input
                    id="brand"
                    name="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    placeholder="e.g. Sony, Nike"
                    className={iconInputClasses}
                  />
                </div>
                {state.errors?.brand && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{state.errors.brand[0]}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        category === cat.id
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40 ring-2 ring-violet-500/20"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={category === cat.id}
                        onChange={() => setCategory(cat.id as ProductType["category"])}
                        className="sr-only"
                      />
                      {category === cat.id && (
                        <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      )}
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
                {state.errors?.category && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{state.errors.category[0]}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 2: Pricing & Stock ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Pricing & Inventory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Set the price and available stock quantity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1.5">
                <label
                  htmlFor="price"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="499.00"
                    className={iconInputClasses}
                  />
                </div>
                {state.errors?.price && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{state.errors.price[0]}</span>
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label
                  htmlFor="qty"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Stock Quantity <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    id="qty"
                    name="qty"
                    type="number"
                    min="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    required
                    placeholder="100"
                    className={iconInputClasses}
                  />
                </div>
                {state.errors?.qty && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{state.errors.qty[0]}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 3: Product Image ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Product Image
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload a new image or keep the existing one
                </p>
              </div>
            </div>

            {/* Current Image Preview */}
            {imageUrl && (
              <div className="relative w-full aspect-video max-w-xs rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={imageUrl}
                  alt={name || "Product"}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                {imageName && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white font-medium truncate">
                    {imageName}
                  </div>
                )}
              </div>
            )}

            {/* Upload New Image */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                isDragging
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                  : "border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 bg-slate-50/60 dark:bg-slate-800/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
              {loading ? (
                <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              )}
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {loading
                  ? "Uploading..."
                  : "Drop a new image here or click to browse"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                PNG, JPG, WebP — max 5 MB
              </p>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </p>
            )}
            {state.errors?.image && (
              <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{state.errors.image[0]}</span>
              </p>
            )}
          </div>

          {/* ── Section 4: Description & Usage ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Description & Usage
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Help customers understand the product
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe the product features, materials, and benefits..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                />
              </div>
              <p className="text-xs text-slate-400 text-right">
                {description.length}/500
              </p>
              {state.errors?.description && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{state.errors.description[0]}</span>
                </p>
              )}
            </div>

            {/* Usage */}
            <div className="space-y-1.5">
              <label
                htmlFor="usage"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Usage / Care Instructions <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="usage"
                name="usage"
                rows={3}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                required
                placeholder="e.g. Machine wash cold, tumble dry low..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
              />
              {state.errors?.usage && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{state.errors.usage[0]}</span>
                </p>
              )}
            </div>
          </div>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={pending}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-bold transition-all shadow-lg ${
              pending
                ? "bg-slate-400 dark:bg-slate-700 text-white cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white shadow-violet-500/25 dark:shadow-none"
            }`}
          >
            {pending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
