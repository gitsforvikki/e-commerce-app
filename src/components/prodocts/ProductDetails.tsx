"use client";

import { useState } from "react";
import { ProductType } from "@/type";

import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function ProductDetails({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "description",
  );

  const fakeOriginalPrice = 9999.99; // For demonstration of discount badge
  const fakeRating = 4.3; // For demonstration of rating stars
  const fakeReviews = 123; // For demonstration of reviews count
  const fakeSKU = "SKU12345"; // For demonstration of SKU
  const fakeFeatures = [
    "Classic and timeless design",
    "High-quality polarized lenses",
    "Durable and lightweight frame",
    "Provides 100% UV protection",
  ];

  const handleAddToCart = () => {
    // Mock add to cart
    alert(`Added ${quantity} item(s) to cart`);
  };

  const images = [
    product.image,
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop",
  ];

  const discount = Math.round(
    ((fakeOriginalPrice - product.price) / fakeOriginalPrice) * 100,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(fakeRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {fakeRating} ({fakeReviews} reviews)
                  </span>
                </div>
                {product.qty && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-violet-600">
                  ${product.price}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${fakeOriginalPrice}
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Save ${(fakeOriginalPrice - product.price).toFixed(2)} (
                {discount}% off)
              </p>
            </div>

            {/* SKU and Category */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-200 rounded-lg text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">
                  {product.category}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">SKU</p>
                <p className="font-semibold text-foreground">{fakeSKU}</p>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-300 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-300 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                >
                  <Heart
                    size={20}
                    className={isFavorite ? "fill-rose-500 text-rose-500" : ""}
                  />
                  {isFavorite ? "Favorited" : "Add to Wishlist"}
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-violet-500 py-3 rounded-lg font-semibold hover:bg-violet-600 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-200 rounded-lg">
              <div className="text-center space-y-2">
                <Truck size={24} className="mx-auto text-primary" />
                <p className="text-xs text-muted-foreground font-medium">
                  Free Shipping
                </p>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw size={24} className="mx-auto text-primary" />
                <p className="text-xs text-muted-foreground font-medium">
                  Easy Returns
                </p>
              </div>
              <div className="text-center space-y-2">
                <Shield size={24} className="mx-auto text-primary" />
                <p className="text-xs text-muted-foreground font-medium">
                  Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="mt-12 space-y-2 max-w-4xl">
          {/* Description */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "description" ? null : "description",
                )
              }
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold text-foreground">Description</h3>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  expandedSection === "description" ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSection === "description" && (
              <div className="px-4 pb-4 border-t border-border">
                <p className="text-foreground">{product.description}</p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "features" ? null : "features",
                )
              }
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold text-foreground">Features</h3>
              <ChevronDown
                size={20}
                className={`transition-transform ${expandedSection === "features" ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSection === "features" && (
              <div className="px-4 pb-4 border-t border-border">
                <ul className="space-y-2">
                  {fakeFeatures.map((feature: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "shipping" ? null : "shipping",
                )
              }
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold text-foreground">
                Shipping & Returns
              </h3>
              <ChevronDown
                size={20}
                className={`transition-transform ${expandedSection === "shipping" ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSection === "shipping" && (
              <div className="px-4 pb-4 border-t border-border space-y-3 text-foreground text-sm">
                <div>
                  <p className="font-semibold mb-1">Shipping</p>
                  <p className="text-muted-foreground">
                    Free shipping on orders over $50. Delivery within 5-7
                    business days.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Returns</p>
                  <p className="text-muted-foreground">
                    30-day money-back guarantee. Free returns on all orders.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You Might Also Like */}
        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            You Might Also Like
          </h2>
          <p className="text-muted-foreground">More products coming soon...</p>
        </div>
      </div>
    </div>
  );
}
