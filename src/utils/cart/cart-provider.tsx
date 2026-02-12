"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export default function CartProvider({ initialItems }: { initialItems: any }) {
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    setCart(initialItems);
  }, [initialItems, setCart]);

  return null;
}
