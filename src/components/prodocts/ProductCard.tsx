"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ProductType } from "@/type";
import { Heart, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { formatInr } from "@/services/order/pricing.service";

export const ProductCard = ({ _id, image, name, price, category }: ProductType) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCartStore();

  const productUrl = `/${category ? category.toLowerCase() : "products"}/${_id}`;

  const handleAdd = () => {
    startTransition(async () => {
      // zusntant store/client/UI update FIRST
      addItem({
        _id: _id,
        name: name,
        image: image,
        price: price,
        qty: 1,
        total: price,
      });

      //Then update DB/cookies
      await addToCartAction(_id);
    });
  };
  return (
    <div
      className="group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-500/50 flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={productUrl} className="block w-full h-full">
          <Image
            src={image}
            alt={name}
            width={800}
            height={800}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-rose-500 text-rose-500"
                : "text-slate-600 dark:text-slate-300"
            }
          />
        </button>

        {/* Add to cart on hover - Mobile friendly overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => handleAdd()}
            className="cursor-pointer w-full bg-violet-600 text-white py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            {isPending ? "Adding.." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={productUrl} className="block group/link">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover/link:text-violet-600 dark:group-hover/link:text-violet-400 transition-colors text-sm sm:text-base">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {formatInr(Math.round(price * 100))}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Free delivery</span>
        </div>
      </div>
    </div>
  );
};
