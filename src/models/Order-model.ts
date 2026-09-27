import mongoose, { HydratedDocument, Model, Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  pricePaise: number;
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
  providerOrderId?: string;
  refundId?: string;
  refundStatus?: "PENDING" | "PROCESSED" | "FAILED";
  method?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export interface Order {
  userId: Types.ObjectId;
  items: OrderItem[];
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  status:
    | "CREATED"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
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
        pricePaise: { type: Number, required: true, min: 0 },
        image: { type: String },
        qty: { type: Number, required: true },
      },
    ],

    subtotalAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    shippingAmount: { type: Number, required: true, min: 0 },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: { type: String, required: true, enum: ["INR"] },

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      home: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    payment: {
      paymentId: String,
      providerOrderId: String,
      refundId: String,
      refundStatus: { type: String, enum: ["PENDING", "PROCESSED", "FAILED"] },
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
  (mongoose.models.Order as Model<Order> | undefined) ||
  mongoose.model<Order>("Order", orderSchema);
