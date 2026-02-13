"use client";

import Image from "next/image";
import { updateCartAction } from "@/server-actions/cart.action";
import { useCartStore } from "@/store/cartStore";
import { CartItemUiType } from "@/type";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export const CartItemCard = (item: CartItemUiType) => {
  const { _id, name, price, image, qty, total } = item;
  const { updateQty, removeItem } = useCartStore();

  const handleIncrease = async () => {
    //this is for udpate the cookies & DB on server side
    await updateCartAction(item._id, "inc");

    // update UI state/zustand store on client side
    updateQty(item._id, item.qty + 1);
  };

  const handleDecrease = async () => {
    //this is for udpate the cookies & DB on server side
    await updateCartAction(item._id, "dec");

    if (item.qty > 1) {
      // update UI state/zustand store on client side
      updateQty(item._id, item.qty - 1);
    }
  };

  const handleRemove = async () => {
    //this is for udpate the cookies & DB on server side
    await updateCartAction(item._id, "remove");

    // update UI state/zustand store on client side
    removeItem(item._id);
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-300 last:border-b-0 hover:bg-indigo-50 transition-colors items-center">
      <div className="col-span-1 text-muted-foreground">{1}</div>
      <div className="col-span-5 flex items-center gap-4">
        <Image
          src={image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded border border-border"
          width={100}
          height={100}
        />
        <div>
          <h3 className="font-medium text-foreground line-clamp-2">{name}</h3>
        </div>
      </div>
      <div className="col-span-2 text-right font-semibold text-foreground">
        ₹{item.price.toFixed(2)}
      </div>
      <div className="col-span-2 flex items-center justify-center gap-2 border border-slate-300 rounded-lg w-fit mx-auto">
        <button
          onClick={() => handleDecrease()}
          className="px-2 py-1 hover:bg-indigo-200 rounded transition-colors cursor-pointer"
        >
          <Minus size={16} className="text-foreground" />
        </button>
        <span className="w-8 text-center font-semibold text-foreground">
          {qty}
        </span>
        <button
          onClick={() => handleIncrease()}
          className="px-2 py-1 hover:bg-indigo-200 rounded transition-colors cursor-pointer"
        >
          <Plus size={16} className="text-foreground" />
        </button>
      </div>
      <div className="col-span-2 text-right">
        <button
          onClick={() => handleRemove()}
          className="p-2 cursor-pointer rounded transition-colors text-red-600 hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
