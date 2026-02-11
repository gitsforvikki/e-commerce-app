import mongoose, { HydratedDocument, Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  qty: number;
}

export interface Cart {
  userId: Types.ObjectId;
  items: CartItem[];
}

export type CartDocument = HydratedDocument<Cart>;

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User id required"],
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
      },
      qty: {
        type: Number,
        required: [true, "Quantity is required."],
      },
    },
  ],
});

export const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
