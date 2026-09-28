import { connectDB } from "@/lib/db";
import { Cart } from "@/models/Cart-model";
import { Order, type OrderDocument } from "@/models/Order-model";
import { Product } from "@/models/Product";
import { calculateOrderPricing } from "@/services/order/pricing.service";
import { refundProviderPayment } from "@/services/order/payment-provider.service";
import { CashfreePaymentService } from "@/services/payment/cashfree/cashfree.payment.service";
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
  paymentMethod = "Cashfree",
}: {
  userId: string;
  shippingAddress: ShippingAddressType;
  paymentMethod?: string;
}) {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user");
  await connectDB();
  const session = await mongoose.startSession();

  const performCreateOrder = async (
    activeSession?: mongoose.ClientSession,
  ): Promise<OrderDocument> => {
    const cartQuery = Cart.findOne({ userId });
    if (activeSession) cartQuery.session(activeSession);
    const cart = await cartQuery;
    if (!cart?.items.length) throw new Error("Cart is empty");

    const productIds = cart.items.map((item) => item.productId);
    const productsQuery = Product.find({ _id: { $in: productIds } });
    if (activeSession) productsQuery.session(activeSession);
    const products = await productsQuery;

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
          payment: { status: "PENDING", method: paymentMethod },
          status: "CREATED",
        },
      ],
      activeSession ? { session: activeSession } : {},
    );
    return order;
  };

  try {
    let createdOrder: OrderDocument | undefined;
    try {
      createdOrder = await session.withTransaction(async () => {
        return await performCreateOrder(session);
      });
    } catch (transactionErr: unknown) {
      const errMsg =
        transactionErr instanceof Error ? transactionErr.message : "";
      if (
        errMsg.includes("replica set") ||
        errMsg.includes("Transaction numbers are only allowed")
      ) {
        createdOrder = await performCreateOrder();
      } else {
        throw transactionErr;
      }
    }
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
    {
      $set: {
        "payment.providerOrderId": providerOrderId,
        "payment.cashfreeOrderId": providerOrderId,
      },
    },
    { new: true },
  );
  if (!order) throw new Error("Unable to initialize payment for this order");
  return order;
}

export async function settleCapturedOrder({
  orderId,
  providerOrderId,
  paymentId,
  paymentMethod = "Cashfree",
}: {
  orderId: string;
  providerOrderId?: string;
  paymentId: string;
  paymentMethod?: string;
}) {
  if (!Types.ObjectId.isValid(orderId)) throw new Error("Invalid order ID");
  await connectDB();
  const session = await mongoose.startSession();

  try {
    let alreadySettled = false;

    const performSettlement = async (activeSession?: mongoose.ClientSession) => {
      const orderQuery = Order.findById(orderId);
      if (activeSession) orderQuery.session(activeSession);
      const order = await orderQuery;
      if (!order) throw new Error("Order not found");

      if (
        providerOrderId &&
        order.payment.providerOrderId &&
        order.payment.providerOrderId !== providerOrderId &&
        order.payment.cashfreeOrderId !== providerOrderId
      ) {
        throw new Error("Payment does not match this order");
      }

      if (
        order.payment.status === "SUCCESS" ||
        order.payment.status === "PAID"
      ) {
        alreadySettled = true;
        return;
      }

      // In standalone mode without transactions, acquire an atomic optimistic lock
      // to eliminate race conditions between concurrent webhooks and browser verifications
      if (!activeSession) {
        const locked = await Order.findOneAndUpdate(
          {
            _id: orderId,
            status: { $nin: ["CONFIRMED", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
            "payment.status": { $nin: ["SUCCESS", "PAID"] },
          },
          { $set: { status: "PROCESSING" } },
          { new: true },
        );

        if (!locked) {
          const latest = await Order.findById(orderId);
          if (
            latest?.payment.status === "SUCCESS" ||
            latest?.payment.status === "PAID"
          ) {
            alreadySettled = true;
            return;
          }
          if (latest?.status === "PROCESSING") {
            // Already being settled by concurrent request
            return;
          }
          throw new Error("Order is not awaiting payment");
        }
      }

      const decrementedItems: { productId: Types.ObjectId; qty: number }[] = [];
      try {
        for (const item of order.items) {
          const updateQuery = Product.updateOne(
            { _id: item.productId, qty: { $gte: item.qty } },
            { $inc: { qty: -item.qty } },
          );
          if (activeSession) updateQuery.session(activeSession);
          const result = await updateQuery;
          if (result.modifiedCount !== 1) {
            throw new InsufficientInventoryError(item.name);
          }
          if (!activeSession) {
            decrementedItems.push({ productId: item.productId, qty: item.qty });
          }
        }
      } catch (inventoryError) {
        if (!activeSession && decrementedItems.length > 0) {
          await Promise.all(
            decrementedItems.map((d) =>
              Product.updateOne(
                { _id: d.productId },
                { $inc: { qty: d.qty } },
              ),
            ),
          );
        }
        throw inventoryError;
      }

      order.payment.status = "SUCCESS";
      order.payment.paymentId = paymentId;
      order.payment.cashfreePaymentId = paymentId;
      order.payment.paidAt = new Date();
      if (paymentMethod) order.payment.method = paymentMethod;
      order.status = "CONFIRMED";
      if (activeSession) {
        await order.save({ session: activeSession });
      } else {
        await order.save();
      }

      const cartQuery = Cart.findOne({ userId: order.userId });
      if (activeSession) cartQuery.session(activeSession);
      const cart = await cartQuery;
      if (cart) {
        for (const purchasedItem of order.items) {
          const cartItem = cart.items.find(
            (item) =>
              item.productId.toString() === purchasedItem.productId.toString(),
          );
          if (cartItem) cartItem.qty -= purchasedItem.qty;
        }
        cart.items = cart.items.filter((item) => item.qty > 0);
        if (activeSession) {
          await cart.save({ session: activeSession });
        } else {
          await cart.save();
        }
      }
    };

    try {
      await session.withTransaction(async () => {
        await performSettlement(session);
      });
    } catch (transactionErr: unknown) {
      const errMsg =
        transactionErr instanceof Error ? transactionErr.message : "";
      if (
        errMsg.includes("replica set") ||
        errMsg.includes("Transaction numbers are only allowed")
      ) {
        console.warn(
          "[Settlement] Running non-transactional settlement fallback (standalone MongoDB detected)",
        );
        await performSettlement();
      } else {
        throw transactionErr;
      }
    }

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
  if (!order.payment.providerOrderId && !order.payment.cashfreeOrderId)
    throw new Error("Provider order is missing");

  order.payment.status = "SUCCESS";
  order.payment.paymentId = paymentId;
  order.payment.refundStatus = "PENDING";
  order.status = "CANCELLED";
  await order.save();

  // If order was paid via Cashfree, initiate Cashfree refund
  if (
    order.payment.method === "Cashfree" ||
    order.payment.cashfreeOrderId ||
    order.payment.providerOrderId?.startsWith("ord_")
  ) {
    const cfOrderId =
      order.payment.cashfreeOrderId || order.payment.providerOrderId!;
    const refund = await CashfreePaymentService.createRefund({
      cashfreeOrderId: cfOrderId,
      amountPaise: order.totalAmount,
      refundId: `ref_${order._id.toString()}_${Date.now()}`,
      refundNote: "Insufficient inventory refund",
    });

    const isProcessed =
      refund.status === "successful" || refund.status === "processed";

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          "payment.refundId": refund.refundId,
          "payment.refundStatus": isProcessed ? "PROCESSED" : "PENDING",
        },
      },
    );

    return {
      refunded: isProcessed,
      refundPending: !isProcessed,
    };
  }

  // Fallback to Razorpay if paid via Razorpay
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
  providerOrderId?: string;
  paymentId: string;
  paymentMethod?: string;
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
