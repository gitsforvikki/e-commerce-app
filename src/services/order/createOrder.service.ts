import { connectDB } from "@/lib/db";
import { Cart } from "@/models/Cart-model";
import { Order, type OrderDocument } from "@/models/Order-model";
import { Product } from "@/models/Product";
import { calculateOrderPricing } from "@/services/order/pricing.service";
import { refundProviderPayment } from "@/services/order/payment-provider.service";
import type { ShippingAddressType } from "@/validators/shippingAddressValidator";
import mongoose, { Types } from "mongoose";

export class InsufficientInventoryError extends Error {
  constructor(productName: string) {
    super(
      `Insufficient stock for ${productName}; the captured payment will be refunded`,
    );
    this.name = "InsufficientInventoryError";
  }
}

export async function createOrderService({
  userId,
  shippingAddress,
}: {
  userId: string;
  shippingAddress: ShippingAddressType;
}) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user");
  await connectDB();
  const session = await mongoose.startSession();

  try {
    const createdOrder = await session.withTransaction(
      async (): Promise<OrderDocument> => {
        const cart = await Cart.findOne({ userId }).session(session);
        if (!cart?.items.length) throw new Error("Cart is empty");

        const productIds = cart.items.map((item) => item.productId);
        const products = await Product.find({
          _id: { $in: productIds },
        }).session(session);
        const orderItems = cart.items.map((cartItem) => {
          const product = products.find(
            (candidate) =>
              candidate._id.toString() === cartItem.productId.toString(),
          );
          if (!product)
            throw new Error("A product in your cart is no longer available");
          if (
            !Number.isInteger(cartItem.qty) ||
            cartItem.qty < 1 ||
            cartItem.qty > product.qty
          ) {
            throw new Error(`${product.name} does not have enough stock`);
          }
          return {
            productId: product._id,
            name: product.name,
            pricePaise: Math.round(product.price * 100),
            image: product.image,
            qty: cartItem.qty,
          };
        });
        const pricing = calculateOrderPricing(
          orderItems.map((item) => ({
            price: item.pricePaise / 100,
            qty: item.qty,
          })),
        );

        const [order] = await Order.create(
          [
            {
              userId: new Types.ObjectId(userId),
              items: orderItems,
              ...pricing,
              shippingAddress,
              payment: { status: "PENDING", method: "Razorpay" },
              status: "CREATED",
            },
          ],
          { session },
        );
        return order;
      },
    );
    if (!createdOrder) throw new Error("Order was not created");
    return createdOrder;
  } finally {
    await session.endSession();
  }
}

export async function attachProviderOrder(
  orderId: string,
  providerOrderId: string,
) {
  await connectDB();
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "CREATED", "payment.status": "PENDING" },
    { $set: { "payment.providerOrderId": providerOrderId } },
    { new: true },
  );
  if (!order) throw new Error("Unable to initialize payment for this order");
  return order;
}

export async function settleCapturedOrder({
  orderId,
  providerOrderId,
  paymentId,
}: {
  orderId: string;
  providerOrderId: string;
  paymentId: string;
}) {
  if (!Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID");
  await connectDB();
  const session = await mongoose.startSession();

  try {
    let alreadySettled = false;
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new Error("Order not found");
      if (order.payment.providerOrderId !== providerOrderId) {
        throw new Error("Payment does not match this order");
      }
      if (
        order.payment.status === "SUCCESS" &&
        order.payment.paymentId === paymentId
      ) {
        alreadySettled = true;
        return;
      }
      if (order.payment.status !== "PENDING" || order.status !== "CREATED") {
        throw new Error("Order is not awaiting payment");
      }

      for (const item of order.items) {
        const result = await Product.updateOne(
          { _id: item.productId, qty: { $gte: item.qty } },
          { $inc: { qty: -item.qty } },
          { session },
        );
        if (result.modifiedCount !== 1) {
          throw new InsufficientInventoryError(item.name);
        }
      }

      order.payment.status = "SUCCESS";
      order.payment.paymentId = paymentId;
      order.status = "PAID";
      await order.save({ session });

      const cart = await Cart.findOne({ userId: order.userId }).session(
        session,
      );
      if (cart) {
        for (const purchasedItem of order.items) {
          const cartItem = cart.items.find(
            (item) =>
              item.productId.toString() === purchasedItem.productId.toString(),
          );
          if (cartItem) cartItem.qty -= purchasedItem.qty;
        }
        cart.items = cart.items.filter((item) => item.qty > 0);
        await cart.save({ session });
      }
    });
    return { alreadySettled };
  } finally {
    await session.endSession();
  }
}

export async function refundCapturedOrder({
  orderId,
  paymentId,
}: {
  orderId: string;
  paymentId: string;
}) {
  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found for refund");
  if (order.payment.paymentId && order.payment.paymentId !== paymentId) {
    throw new Error("Refund payment does not match order");
  }
  if (order.payment.refundStatus === "PROCESSED") return { refunded: true };
  if (!order.payment.providerOrderId)
    throw new Error("Provider order is missing");

  order.payment.status = "SUCCESS";
  order.payment.paymentId = paymentId;
  order.payment.refundStatus = "PENDING";
  order.status = "CANCELLED";
  await order.save();

  const refund = await refundProviderPayment(
    paymentId,
    order.totalAmount,
    order._id.toString(),
  );
  await Order.updateOne(
    { _id: order._id, "payment.paymentId": paymentId },
    {
      $set: {
        "payment.refundId": refund.id,
        "payment.refundStatus":
          refund.status === "processed" ? "PROCESSED" : "PENDING",
      },
    },
  );
  return {
    refunded: refund.status === "processed",
    refundPending: refund.status !== "processed",
  };
}

export async function settleOrRefundCapturedOrder(input: {
  orderId: string;
  providerOrderId: string;
  paymentId: string;
}) {
  try {
    return { ...(await settleCapturedOrder(input)), refunded: false };
  } catch (error) {
    if (!(error instanceof InsufficientInventoryError)) throw error;
    const refund = await refundCapturedOrder({
      orderId: input.orderId,
      paymentId: input.paymentId,
    });
    return { alreadySettled: false, ...refund };
  }
}
