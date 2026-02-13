import { create } from "zustand";

interface CartState {
  items: any[];
  setCart: (items: any[]) => void;
  addItem: (item: any) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  setCart: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i._id === item._id);

      if (exists) {
        return {
          items: state.items.map((i) =>
            i._id === item._id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),
  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i._id === id ? { ...i, qty } : i)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
}));
