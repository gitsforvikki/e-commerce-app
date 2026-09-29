"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  DollarSign,
  Package,
  FileText,
  Eye,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Check,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { addProduct, ProductFormState } from "@/server-actions/product.actions";
import { routes } from "@/utils/routes";

const initialState: ProductFormState = {
  success: false,
};

const CATEGORIES = [
  { id: "MEN", label: "Men's Collection", tag: "Fashion & Tech" },
  { id: "WOMEN", label: "Women's Collection", tag: "Designer & Luxury" },
  { id: "KIDS", label: "Kids & Youth", tag: "Apparel & Gear" },
];

export const UploadProductForm = () => {
  // Form fields for real-time live preview
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [category, setCategory] = useState("MEN");
  const [description, setDescription] = useState("");
  const [usage, setUsage] = useState("");

  // Image Upload state
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(addProduct, initialState);

  // Handle Cloudinary file upload
  async function handleImageUpload(file: File) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB");
      return;
    }

    setLoading(true);
    setUploadError("");
    setImageName(file.name);
    setImageSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || typeof data.url !== "string") {
        throw new Error(data.message || "Image upload failed");
      }
      setImageUrl(data.url);
    } catch (error) {
      setImageUrl("");
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageName("");
    setImageSize("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Readiness checklist
  const isNameValid = name.trim().length >= 3;
  const isBrandValid = brand.trim().length >= 2;
  const isPriceValid = Number(price) > 0;
  const isQtyValid = Number(qty) >= 0 && qty !== "";
  const isImageValid = Boolean(imageUrl);
  const isDescValid = description.trim().length >= 1;

  const checklistScore = [
    isNameValid,
    isBrandValid,
    isPriceValid,
    isQtyValid,
    isImageValid,
    isDescValid,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ================= HEADER BAR ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Catalog Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Create New Product
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Upload high-resolution media, specify inventory details, and publish
              instantly to the live ShopHub storefront.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={routes.PRODUCTS}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Catalog View</span>
            </Link>
          </div>
        </div>

        {/* Global Error Banner */}
        {state.error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="font-medium">
              {state.error === "Failed to add product"
                ? "Unable to create product. Please review all fields and try again."
                : state.error}
            </div>
          </div>
        )}

        {/* ================= 2-COLUMN STUDIO LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: FORM SECTIONS ================= */}
          <form action={action} className="lg:col-span-7 space-y-6">
            {/* 1. Basic Details Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
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
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Premium SoundPulse Wireless Headphones"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  />
                </div>
                {state.errors?.name && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{state.errors.name[0]}</span>
                  </p>
                )}
              </div>

              {/* Brand and Category (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="brand"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Brand / Manufacturer <span className="text-rose-500">*</span>
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
                      placeholder="e.g. Sony, Nike, Apple"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                    />
                  </div>
                  {state.errors?.brand && (
                    <p className="text-xs text-rose-500 font-medium mt-1">
                      {state.errors.brand[0]}
                    </p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="category"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all cursor-pointer font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} ({cat.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  {state.errors?.category && (
                    <p className="text-xs text-rose-500 font-medium mt-1">
                      {state.errors.category[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Product Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {description.length}/500
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Highlight key materials, premium craftsmanship, aesthetic details, and what makes this item special..."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-y"
                />
                {state.errors?.description && (
                  <p className="text-xs text-rose-500 font-medium mt-1">
                    {state.errors.description[0]}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Pricing & Inventory Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Pricing & Inventory
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unit price in USD and stock quantities
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
                    Price (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
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
                      placeholder="99.99"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold"
                    />
                  </div>
                  {state.errors?.price && (
                    <p className="text-xs text-rose-500 font-medium mt-1">
                      {state.errors.price[0]}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="qty"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Inventory Units <span className="text-rose-500">*</span>
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
                      placeholder="50"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold"
                    />
                  </div>
                  {state.errors?.qty && (
                    <p className="text-xs text-rose-500 font-medium mt-1">
                      {state.errors.qty[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Usage & Care Instructions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="usage"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Usage & Care Guide <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {usage.length}/300
                  </span>
                </div>
                <textarea
                  id="usage"
                  name="usage"
                  rows={2}
                  maxLength={300}
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  required
                  placeholder="e.g. Dry clean only. Keep away from direct excessive heat. Store in dust bag."
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-y"
                />
                {state.errors?.usage && (
                  <p className="text-xs text-rose-500 font-medium mt-1">
                    {state.errors.usage[0]}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Media Upload Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Product Media
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cloudinary-backed CDN image asset (max 5 MB)
                    </p>
                  </div>
                </div>

                {imageUrl && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />

              {/* Hidden input to pass uploaded image URL to server action */}
              <input type="hidden" name="image" value={imageUrl} />

              {/* Upload Dropzone */}
              {!imageUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-3 ${
                    isDragging
                      ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-xs">
                    {loading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <UploadCloud className="w-7 h-7" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {loading ? (
                        <span>Uploading asset to Cloudinary...</span>
                      ) : (
                        <>
                          <span className="text-violet-600 dark:text-violet-400 hover:underline">
                            Click to upload
                          </span>{" "}
                          or drag & drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      PNG, JPG, or WebP up to 5 MB (Aspect ratio 1:1 or 4:5 recommended)
                    </p>
                  </div>
                </div>
              ) : (
                /* Uploaded State Card */
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0">
                      <Image
                        src={imageUrl}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {imageName || "product-image.jpg"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {imageSize || "Cloudinary CDN Hosted"}
                      </p>
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 inline-flex items-center gap-1 hover:underline mt-0.5"
                      >
                        <span>View Raw Asset</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold cursor-pointer"
                      title="Replace file"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs font-semibold cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Error feedback */}
              {uploadError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </p>
              )}

              {state.errors?.image && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{state.errors.image[0]}</span>
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!imageUrl || loading || pending}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {pending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing to Catalog...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Publish Product to Store</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ================= RIGHT COLUMN: LIVE STOREFRONT PREVIEW ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Live Preview Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-black/40 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Eye className="w-4 h-4 text-violet-500" />
                  <span>Live Storefront Preview</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Mock Product Card rendered exactly like ShopHub storefront */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 overflow-hidden shadow-xs group transition-all">
                {/* Product Image Area */}
                <div className="relative aspect-square w-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name || "Product Image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2 p-6 text-center">
                      <UploadCloud className="w-10 h-10 stroke-[1.5]" />
                      <p className="text-xs font-medium">
                        Upload an image to see live card preview
                      </p>
                    </div>
                  )}

                  {/* Category Pill on Card */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-violet-600 dark:text-violet-400 backdrop-blur-md shadow-xs border border-white/20">
                    {category}
                  </span>

                  {/* Stock Pill on Card */}
                  {qty !== "" && (
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md border ${
                        Number(qty) > 0
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                          : "bg-rose-950/80 text-rose-300 border-rose-500/30"
                      }`}
                    >
                      {Number(qty) > 0 ? `${qty} in stock` : "Out of Stock"}
                    </span>
                  )}
                </div>

                {/* Card Info Area */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wider font-extrabold text-violet-600 dark:text-violet-400">
                      {brand || "BRAND NAME"}
                    </p>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
                      {name || "Your Product Name Will Appear Here"}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {description ||
                      "Detailed item description highlighting premium craftsmanship, materials, and features..."}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Price
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {price ? `$${Number(price).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-bold opacity-80 cursor-default"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Publication Checklist */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200/70 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Readiness Score
                  </span>
                  <span className="font-extrabold text-violet-600 dark:text-violet-400">
                    {checklistScore} / 6 Complete
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(checklistScore / 6) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {isNameValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Title (≥3 char)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isBrandValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Brand (≥2 char)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPriceValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Valid Price</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isQtyValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Stock Set</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isImageValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Cloudinary Asset</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isDescValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 ml-1 mr-1" />
                    )}
                    <span>Description</span>
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Note */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted direct-to-Cloudinary upload pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

