import "server-only";
import { getCashfreeConfig } from "@/lib/payment/cashfree.config";
import {
  rupeesToPaise,
  verifyCashfreeWebhookSignature,
} from "@/lib/payment/cashfree.utils";
import {
  CASHFREE_PAYMENT_STATUS,
  CASHFREE_WEBHOOK_EVENTS,
} from "@/lib/payment/cashfree.constants";
import type { CashfreeWebhookPayload } from "@/lib/payment/cashfree.types";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { settleOrRefundCapturedOrder } from "@/services/order/createOrder.service";
import { Types } from "mongoose";

export class CashfreeWebhookService {
  /**
   * Processes an incoming Cashfree webhook with raw body signature verification,
   * amount cross-validation, and idempotent transactional database settlement.
   */
  static async processWebhook({
    rawBody,
    signature,
    timestamp,
  }: {
    rawBody: string;
    signature: string | null;
    timestamp: string | null;
  }) {
    const config = getCashfreeConfig();

    // 1. Webhook Authenticity Verification (HMAC-SHA256 on timestamp + rawBody)
    const isValidSignature = verifyCashfreeWebhookSignature({
      rawBody,
      timestamp,
      signature,
      secretKey: config.secretKey,
    });

    if (!isValidSignature) {
      console.error("[Cashfree Webhook] Invalid webhook signature detected.");
      throw new Error("INVALID_SIGNATURE");
    }

    // 2. Parse raw payload
    let payload: CashfreeWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as CashfreeWebhookPayload;
    } catch {
      console.error("[Cashfree Webhook] Failed to parse webhook JSON payload.");
      throw new Error("INVALID_PAYLOAD");
    }

    const eventType = payload?.type;

    // If it's not a payment success event, handle cancellation/drop or return received
    if (eventType !== CASHFREE_WEBHOOK_EVENTS.PAYMENT_SUCCESS) {
      if (
        eventType === CASHFREE_WEBHOOK_EVENTS.PAYMENT_FAILED ||
        eventType === CASHFREE_WEBHOOK_EVENTS.PAYMENT_USER_DROPPED
      ) {
        const cfOrderId = payload.data?.order?.order_id;
        if (cfOrderId) {
          await connectDB();
          await Order.updateOne(
            {
              $or: [
                { "payment.cashfreeOrderId": cfOrderId },
                { "payment.providerOrderId": cfOrderId },
              ],
              status: "CREATED",
            },
            {
              $set: {
                "payment.status": "FAILED",
                status: "CANCELLED",
              },
            },
          );
        }
      }
      return { success: true, message: `Event ${eventType} acknowledged` };
    }

    // 3. Extract order and payment details
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    if (!orderData?.order_id || !paymentData?.cf_payment_id) {
      console.error("[Cashfree Webhook] Missing order or payment entity in payload.");
      throw new Error("MALFORMED_EVENT_DATA");
    }

    const cfOrderId = String(orderData.order_id);
    const cfPaymentId = String(paymentData.cf_payment_id);
    const paymentStatus = String(paymentData.payment_status || "").toUpperCase();
    const paidAmountPaise = rupeesToPaise(Number(paymentData.payment_amount));

    if (paymentStatus !== CASHFREE_PAYMENT_STATUS.SUCCESS) {
      console.warn(
        `[Cashfree Webhook] Payment status is not SUCCESS: ${paymentStatus}`,
      );
      return { success: true, message: `Payment status is ${paymentStatus}` };
    }

    await connectDB();

    // 4. Find the local MongoDB Order using stored Cashfree order ID or parsed ID
    const rawLocalId = cfOrderId.startsWith("ord_")
      ? cfOrderId.slice(4)
      : cfOrderId;

    const query: Record<string, unknown> = {
      $or: [
        { "payment.cashfreeOrderId": cfOrderId },
        { "payment.providerOrderId": cfOrderId },
      ],
    };

    if (Types.ObjectId.isValid(rawLocalId)) {
      (query.$or as unknown[]).push({ _id: new Types.ObjectId(rawLocalId) });
    }

    const order = await Order.findOne(query);

    if (!order) {
      console.error(
        `[Cashfree Webhook] No local order found matching Cashfree order ID: ${cfOrderId}`,
      );
      throw new Error("ORDER_NOT_FOUND");
    }

    // 5. Cross-validate payment amount against server-side order total
    if (order.totalAmount !== paidAmountPaise) {
      console.error(
        `[Cashfree Webhook] Amount tampering detected! Order expected ${order.totalAmount} paise, received ${paidAmountPaise} paise.`,
      );
      throw new Error("AMOUNT_MISMATCH");
    }

    // 6. Idempotency Check: if order is already paid, do not repeat side effects
    if (
      (order.payment.status === "SUCCESS" || order.payment.status === "PAID") &&
      (order.status === "CONFIRMED" || order.status === "PAID")
    ) {
      return {
        success: true,
        alreadySettled: true,
        orderId: order._id.toString(),
      };
    }

    // 7. Settle the order atomically in MongoDB (or refund if inventory exhausted)
    const settlement = await settleOrRefundCapturedOrder({
      orderId: order._id.toString(),
      providerOrderId: cfOrderId,
      paymentId: cfPaymentId,
      paymentMethod: "Cashfree",
    });

    return {
      success: true,
      alreadySettled: settlement.alreadySettled,
      refunded: settlement.refunded,
      orderId: order._id.toString(),
    };
  }
}
