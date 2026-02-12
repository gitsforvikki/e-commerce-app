import { create } from "zustand";

interface CartState {
  items: any[];
  setCart: (items: any[]) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  setCart: (items) => set({ items }),

  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? { ...i, qty } : i)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
}));
