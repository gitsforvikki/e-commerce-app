"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ProductType } from "@/type";
import { addToCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { formatInr } from "@/services/order/pricing.service";
import { Heart, ShoppingCart, Truck, Shield, ChevronDown } from "lucide-react";

export default function ProductDetails({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "description",
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCartStore();
  const available = Number.isInteger(product.qty) && product.qty > 0;

  const handleAddToCart = () => {
    setError(null);
    startTransition(async () => {
      try {
        await addToCartAction(product._id, quantity);
        addItem({
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: quantity,
          total: product.price * quantity,
        });
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to add this item to your cart",
        );
      }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <p
                className={
                  available
                    ? "text-sm font-medium text-green-700"
                    : "text-sm font-medium text-red-700"
                }
              >
                {available ? `${product.qty} available` : "Out of stock"}
              </p>
            </div>

            <p className="text-3xl font-bold text-violet-700">
              {formatInr(Math.round(product.price * 100))}
            </p>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-100 p-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">
                  {product.category}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Brand</p>
                <p className="font-semibold text-foreground">{product.brand}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    className="px-4 py-2 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-10 px-2 py-2 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={
                      !available || quantity >= product.qty || quantity >= 99
                    }
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(product.qty, 99, value + 1),
                      )
                    }
                    className="px-4 py-2 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFavorite((value) => !value)}
                  aria-pressed={isFavorite}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 font-medium hover:bg-slate-100"
                >
                  <Heart
                    size={20}
                    className={isFavorite ? "fill-rose-500 text-rose-500" : ""}
                  />
                  {isFavorite ? "Saved" : "Save for later"}
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!available || isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-3 text-lg font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart size={22} />
                {isPending
                  ? "Adding…"
                  : available
                    ? "Add to cart"
                    : "Out of stock"}
              </button>
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-100 p-4">
              <div className="flex items-center gap-3">
                <Truck size={22} className="text-violet-700" />
                <span className="text-sm">Shipping calculated at checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={22} className="text-violet-700" />
                <span className="text-sm">Secure payment checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-4xl space-y-2">
          <section className="overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => toggleSection("description")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-muted"
            >
              <h2 className="font-semibold">Description</h2>
              <ChevronDown
                size={20}
                className={
                  expandedSection === "description" ? "rotate-180" : ""
                }
              />
            </button>
            {expandedSection === "description" && (
              <p className="border-t border-border px-4 py-4 text-foreground">
                {product.description || "No description provided."}
              </p>
            )}
          </section>
          <section className="overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => toggleSection("usage")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-muted"
            >
              <h2 className="font-semibold">Usage information</h2>
              <ChevronDown
                size={20}
                className={expandedSection === "usage" ? "rotate-180" : ""}
              />
            </button>
            {expandedSection === "usage" && (
              <p className="border-t border-border px-4 py-4 text-foreground">
                {product.usage || "No usage information provided."}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
