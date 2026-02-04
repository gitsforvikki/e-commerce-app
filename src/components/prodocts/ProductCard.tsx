"use client";

import { useState } from "react";
import { ProductType } from "@/type";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export const ProductCard = ({ _id, image, name, price }: ProductType) => {
  const [isFavorite, setIsFavorite] = useState(false);
  //   const discount = originalPrice
  //     ? Math.round(((originalPrice - price) / originalPrice) * 100)
  //     : 0;

  return (
    <Link
      href={`/product/${_id}`}
      className="group h-full rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {/* {discount > 0 && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )} */}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform hover:bg-primary/10"
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-destructive text-destructive"
                : "text-foreground"
            }
          />
        </button>

        {/* Add to cart on hover - Mobile friendly overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
            }}
            className="w-full bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
          {name}
        </h3>

        {/* Rating */}
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div> */}

        {/* Price */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          {/* {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )} */}
        </div>
      </div>
    </Link>
  );
};
