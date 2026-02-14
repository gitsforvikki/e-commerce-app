import mongoose, { HydratedDocument, Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  addressLine: string;
}

export interface PaymentInfo {
  paymentId?: string;
  method?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export interface Order {
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  status:
    | "CREATED"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

export type OrderDocument = HydratedDocument<Order>;

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        qty: { type: Number, required: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      addressLine: { type: String, required: true },
    },

    payment: {
      paymentId: String,
      method: String,
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "CREATED",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order =
  mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);
