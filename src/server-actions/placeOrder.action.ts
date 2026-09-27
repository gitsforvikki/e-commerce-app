"use server";

import { requireUser } from "@/lib/access-control";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { Cart } from "@/models/Cart-model";
import { Product } from "@/models/Product";
import {
  attachProviderOrder,
  createOrderService,
  settleOrRefundCapturedOrder,
} from "@/services/order/createOrder.service";
import {
  createProviderOrder,
  fetchProviderPayment,
  verifyCheckoutSignature,
} from "@/services/order/payment-provider.service";
import { shippingAddressValidator } from "@/validators/shippingAddressValidator";
import { Types } from "mongoose";
import { z } from "zod";

export async function PlaceOrderActions() {
  const user = await requireUser();
  const parsedAddress = shippingAddressValidator.safeParse({
    name: `${user.firstName} ${user.lastName}`.trim(),
    phone: user.phone == null ? "" : String(user.phone),
    home: user.address?.home ?? "",
    city: user.address?.city ?? "",
    state: user.address?.state ?? "",
    pincode:
      user.address?.pincode == null
        ? ""
        : String(user.address.pincode).padStart(6, "0"),
  });
  if (!parsedAddress.success) {
    throw new Error(
      "Complete a valid shipping address in your profile before checkout",
    );
  }

  await connectDB();
  let pendingOrder = await Order.findOne({
    userId: user._id,
    status: "CREATED",
    "payment.status": "PENDING",
  }).sort({ createdAt: -1 });
  if (pendingOrder) {
    const cart = await Cart.findOne({ userId: user._id });
    const productIds = cart?.items.map((item) => item.productId) ?? [];
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "_id price",
    );
    const sameItems =
      Boolean(cart?.items.length) &&
      cart!.items.length === pendingOrder.items.length &&
      cart!.items.every((cartItem) => {
        const snapshot = pendingOrder!.items.find(
          (item) => item.productId.toString() === cartItem.productId.toString(),
        );
        const product = products.find(
          (candidate) =>
            candidate._id.toString() === cartItem.productId.toString(),
        );
        return (
          Boolean(snapshot && product) &&
          snapshot!.qty === cartItem.qty &&
          snapshot!.pricePaise === Math.round(product!.price * 100)
        );
      });
    const sameAddress =
      JSON.stringify(pendingOrder.shippingAddress) ===
      JSON.stringify(parsedAddress.data);
    if (!sameItems || !sameAddress) {
      pendingOrder.status = "CANCELLED";
      pendingOrder.payment.status = "FAILED";
      await pendingOrder.save();
      pendingOrder = null;
    }
  }

  let order = pendingOrder;
  if (!order) {
    order = await createOrderService({
      userId: user._id.toString(),
      shippingAddress: parsedAddress.data,
    });
  }

  try {
    const providerOrder = order.payment.providerOrderId
      ? {
          id: order.payment.providerOrderId,
          amount: order.totalAmount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        }
      : await createProviderOrder(order.totalAmount, order._id.toString());
    if (!providerOrder.keyId)
      throw new Error("Payment provider is not configured");
    if (!order.payment.providerOrderId) {
      await attachProviderOrder(order._id.toString(), providerOrder.id);
    }
    return {
      success: true,
      orderId: order._id.toString(),
      providerOrderId: providerOrder.id,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      keyId: providerOrder.keyId,
      customer: {
        name: parsedAddress.data.name,
        email: user.email,
        contact: parsedAddress.data.phone,
      },
    };
  } catch (error) {
    await connectDB();
    await Order.updateOne(
      { _id: order._id, "payment.status": "PENDING" },
      { $set: { status: "CANCELLED", "payment.status": "FAILED" } },
    );
    throw error;
  }
}

const paymentResultSchema = z.object({
  orderId: z.string().regex(/^[a-f\d]{24}$/i),
  providerOrderId: z.string().min(5).max(100),
  paymentId: z.string().min(5).max(100),
  signature: z.string().regex(/^[a-f\d]{64}$/i),
});

export async function verifyPaymentAction(input: unknown) {
  const user = await requireUser();
  const parsed = paymentResultSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid payment confirmation");
  const { orderId, providerOrderId, paymentId, signature } = parsed.data;

  if (!verifyCheckoutSignature({ providerOrderId, paymentId, signature })) {
    throw new Error("Payment signature verification failed");
  }

  await connectDB();
  const order = await Order.findOne({ _id: orderId, userId: user._id });
  if (!order || order.payment.providerOrderId !== providerOrderId) {
    throw new Error("Order not found");
  }
  const payment = await fetchProviderPayment(paymentId);
  if (
    payment.order_id !== providerOrderId ||
    payment.amount !== order.totalAmount ||
    payment.currency !== order.currency ||
    payment.status !== "captured"
  ) {
    throw new Error("Payment is not captured for the expected amount");
  }

  const settlement = await settleOrRefundCapturedOrder({
    orderId,
    providerOrderId,
    paymentId,
  });
  return { success: true, orderId, ...settlement };
}

export async function getOwnedOrder(orderId: string) {
  const user = await requireUser();
  if (!Types.ObjectId.isValid(orderId)) return null;
  await connectDB();
  return Order.findOne({ _id: orderId, userId: user._id }).lean();
}
