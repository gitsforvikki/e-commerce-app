"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

export default function CartProvider({
  initialItems,
  children,
}: {
  initialItems: any;
  children: React.ReactNode;
}) {
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    setCart(initialItems);
  }, [initialItems, setCart]);

  return <>{children}</>;
}
