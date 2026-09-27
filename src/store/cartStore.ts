import { create } from "zustand";

export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
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
            i._id === item._id
              ? {
                  ...i,
                  qty: i.qty + (item.qty ?? 1),
                  total: i.price * (i.qty + (item.qty ?? 1)),
                }
              : i,
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),
  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i._id === id ? { ...i, qty, total: i.price * qty } : i,
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
}));
