"use client";

import { addToCartAction } from "@/server-actions/cart.action";
import { useTransition } from "react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      addToCartAction(productId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="bg-black text-white px-4 py-2 rounded"
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
