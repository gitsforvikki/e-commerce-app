import mongoose, { HydratedDocument, Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface Order {
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  paymentId?: string;
  address: {
    home: string;
    city: string;
    state: string;
    pincode: number;
  };
}

export type OrderDocument = HydratedDocument<Order>;

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: String,
        price: Number,
        image: String,
        qty: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING",
    },

    paymentId: String,

    address: {
      home: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
