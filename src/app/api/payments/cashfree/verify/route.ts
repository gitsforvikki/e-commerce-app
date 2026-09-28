import { requireUser } from "@/lib/access-control";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { settleOrRefundCapturedOrder } from "@/services/order/createOrder.service";
import { CashfreePaymentService } from "@/services/payment/cashfree/cashfree.payment.service";
import { Types } from "mongoose";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = (await request.json()) as {
      orderId?: string;
      cashfreeOrderId?: string;
    };

    const orderId = body?.orderId?.trim();
    const cashfreeOrderId = body?.cashfreeOrderId?.trim();

    if (!orderId && !cashfreeOrderId) {
      return Response.json(
        {
          success: false,
          message: "Order ID or Cashfree Order ID is required for verification.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Query order ensuring it belongs to the authenticated user
    const query: Record<string, unknown> = { userId: user._id };
    if (orderId && Types.ObjectId.isValid(orderId)) {
      query._id = new Types.ObjectId(orderId);
    } else if (cashfreeOrderId) {
      query.$or = [
        { "payment.cashfreeOrderId": cashfreeOrderId },
        { "payment.providerOrderId": cashfreeOrderId },
      ];
    }

    const order = await Order.findOne(query);

    if (!order) {
      return Response.json(
        {
          success: false,
          message: "Order not found or does not belong to the authenticated user.",
        },
        { status: 404 },
      );
    }

    // Idempotency check: if order is already paid, return early
    if (
      (order.payment.status === "SUCCESS" || order.payment.status === "PAID") &&
      (order.status === "CONFIRMED" || order.status === "PAID")
    ) {
      return Response.json({
        success: true,
        verified: true,
        alreadySettled: true,
        orderId: order._id.toString(),
        cashfreeOrderId: order.payment.cashfreeOrderId,
        paymentId: order.payment.cashfreePaymentId || order.payment.paymentId,
        status: "PAID",
        totalAmount: order.totalAmount,
      });
    }

    // Query Cashfree Server API for payment status
    const targetCfOrderId =
      order.payment.cashfreeOrderId ||
      order.payment.providerOrderId ||
      cashfreeOrderId;

    if (!targetCfOrderId) {
      return Response.json(
        {
          success: false,
          message: "No Cashfree Order ID is associated with this order.",
        },
        { status: 400 },
      );
    }

    const verificationResult = await CashfreePaymentService.verifyOrderPayment({
      cashfreeOrderId: targetCfOrderId,
      expectedAmountPaise: order.totalAmount,
    });

    if (verificationResult.success && verificationResult.status === "PAID") {
      const paymentId = verificationResult.paymentId || "cf_sandbox_success";

      // Settle the order in MongoDB transaction (or auto-refund if stock ran out)
      const settlement = await settleOrRefundCapturedOrder({
        orderId: order._id.toString(),
        providerOrderId: targetCfOrderId,
        paymentId,
        paymentMethod: "Cashfree",
      });

      if (settlement.refunded) {
        return Response.json({
          success: false,
          verified: false,
          refunded: true,
          status: "CANCELLED",
          message: "Payment received but items became out of stock. A full refund has been initiated.",
          orderId: order._id.toString(),
        });
      }

      return Response.json({
        success: true,
        verified: true,
        alreadySettled: settlement.alreadySettled,
        orderId: order._id.toString(),
        cashfreeOrderId: targetCfOrderId,
        paymentId,
        status: "PAID",
        totalAmount: order.totalAmount,
      });
    }

    // Payment is either pending or failed on Cashfree
    if (verificationResult.status === "FAILED") {
      await Order.updateOne(
        { _id: order._id, "payment.status": "PENDING", status: "CREATED" },
        { $set: { "payment.status": "FAILED", status: "CANCELLED" } },
      );
    }

    return Response.json({
      success: false,
      verified: false,
      status: verificationResult.status,
      message: verificationResult.message || "Payment is not confirmed yet.",
      orderId: order._id.toString(),
    });
  } catch (error) {
    console.error("[Cashfree Verification API Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Payment verification failed";
    const isAuthError =
      errorMessage.toLowerCase().includes("auth") ||
      errorMessage.toLowerCase().includes("access");

    return Response.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: isAuthError ? 401 : 500 },
    );
  }
}
