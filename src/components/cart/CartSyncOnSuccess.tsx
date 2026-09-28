"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

/**
 * Client component that immediately synchronizes the client-side Zustand cart
 * with the server cart after a successful order settlement.
 */
export function CartSyncOnSuccess({ shouldSync = true }: { shouldSync?: boolean }) {
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    if (!shouldSync) return;

    // Fetch fresh cart from the server (which was cleared upon payment capture)
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.items)) {
          setCart(data.items);
        } else {
          setCart([]);
        }
      })
      .catch(() => {
        setCart([]);
      });
  }, [shouldSync, setCart]);

  return null;
}
