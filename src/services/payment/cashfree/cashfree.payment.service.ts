import "server-only";
import { paiseToRupees, rupeesToPaise } from "@/lib/payment/cashfree.utils";
import { CASHFREE_PAYMENT_STATUS } from "@/lib/payment/cashfree.constants";
import type {
  CashfreePaymentEntity,
  NormalizedPaymentResult,
} from "@/lib/payment/cashfree.types";
import { cashfreeRequest } from "./cashfree.client";

/**
 * Dedicated service for querying payment status from Cashfree and
 * normalizing payment entities into application-level statuses.
 */
export class CashfreePaymentService {
  /**
   * Fetches all payment transactions associated with a given Cashfree order.
   */
  static async fetchOrderPayments(
    cashfreeOrderId: string,
  ): Promise<CashfreePaymentEntity[]> {
    if (!cashfreeOrderId) {
      throw new Error("Cashfree order ID is required to fetch payments");
    }

    const payments = await cashfreeRequest<CashfreePaymentEntity[]>(
      `/orders/${encodeURIComponent(cashfreeOrderId)}/payments`,
      { method: "GET" },
    );

    return Array.isArray(payments) ? payments : [];
  }

  /**
   * Fetches the details of a specific payment ID for a given Cashfree order.
   */
  static async fetchPaymentDetails(
    cashfreeOrderId: string,
    cfPaymentId: string,
  ): Promise<CashfreePaymentEntity> {
    if (!cashfreeOrderId || !cfPaymentId) {
      throw new Error("Order ID and Payment ID are required to fetch payment details");
    }

    return cashfreeRequest<CashfreePaymentEntity>(
      `/orders/${encodeURIComponent(cashfreeOrderId)}/payments/${encodeURIComponent(cfPaymentId)}`,
      { method: "GET" },
    );
  }

  /**
   * Maps Cashfree payment statuses into application status:
   * "SUCCESS" -> "PAID"
   * "PENDING" -> "PENDING"
   * "FAILED" | "USER_DROPPED" | "CANCELLED" -> "FAILED"
   */
  static normalizePaymentStatus(
    cashfreeStatus?: string,
  ): "PAID" | "PENDING" | "FAILED" {
    if (!cashfreeStatus) return "PENDING";
    const upper = cashfreeStatus.toUpperCase();

    if (upper === CASHFREE_PAYMENT_STATUS.SUCCESS) {
      return "PAID";
    }
    if (upper === CASHFREE_PAYMENT_STATUS.PENDING) {
      return "PENDING";
    }
    return "FAILED";
  }

  /**
   * Verifies whether an order has been successfully paid on Cashfree.
   * If expectedAmountPaise is provided, checks that the paid amount matches
   * the local order total before acknowledging success.
   */
  static async verifyOrderPayment({
    cashfreeOrderId,
    expectedAmountPaise,
  }: {
    cashfreeOrderId: string;
    expectedAmountPaise?: number;
  }): Promise<NormalizedPaymentResult> {
    let payments: CashfreePaymentEntity[] = [];
    try {
      payments = await this.fetchOrderPayments(cashfreeOrderId);
    } catch (fetchErr) {
      console.warn(
        `[Cashfree Payment] Unable to fetch payments array for ${cashfreeOrderId}:`,
        fetchErr instanceof Error ? fetchErr.message : fetchErr,
      );
    }

    // Look for any successful transaction
    const successfulPayment = payments.find(
      (p) => p.payment_status?.toUpperCase() === CASHFREE_PAYMENT_STATUS.SUCCESS,
    );

    if (successfulPayment) {
      const paymentAmountPaise = rupeesToPaise(successfulPayment.payment_amount);

      if (
        typeof expectedAmountPaise === "number" &&
        paymentAmountPaise !== expectedAmountPaise
      ) {
        console.error(
          `[Cashfree Payment] Amount mismatch for order ${cashfreeOrderId}: expected ${expectedAmountPaise} paise, received ${paymentAmountPaise} paise`,
        );
        return {
          success: false,
          orderId: successfulPayment.order_id,
          cashfreeOrderId,
          paymentId: String(successfulPayment.cf_payment_id),
          status: "FAILED",
          rawStatus: successfulPayment.payment_status,
          amountPaise: paymentAmountPaise,
          currency: successfulPayment.payment_currency || "INR",
          message: "Payment amount does not match order amount",
        };
      }

      return {
        success: true,
        orderId: successfulPayment.order_id,
        cashfreeOrderId,
        paymentId: String(successfulPayment.cf_payment_id),
        status: "PAID",
        rawStatus: successfulPayment.payment_status,
        amountPaise: paymentAmountPaise,
        currency: successfulPayment.payment_currency || "INR",
        message: successfulPayment.payment_message || "Payment captured successfully",
      };
    }

    // Fallback: check the Cashfree Order entity directly in case payment webhook/entity is delayed
    try {
      const orderDetails = await cashfreeRequest<{
        cf_order_id: string;
        order_id: string;
        order_status: string;
        order_amount: number;
        order_currency: string;
      }>(`/orders/${encodeURIComponent(cashfreeOrderId)}`, { method: "GET" });

      if (orderDetails?.order_status === "PAID") {
        const amountPaise = rupeesToPaise(orderDetails.order_amount);

        if (
          typeof expectedAmountPaise === "number" &&
          amountPaise !== expectedAmountPaise
        ) {
          console.error(
            `[Cashfree Payment] Direct order amount mismatch for ${cashfreeOrderId}: expected ${expectedAmountPaise} paise, received ${amountPaise} paise`,
          );
          return {
            success: false,
            orderId: orderDetails.order_id,
            cashfreeOrderId,
            paymentId: `cf_paid_${orderDetails.cf_order_id || cashfreeOrderId}`,
            status: "FAILED",
            rawStatus: "PAID",
            amountPaise,
            currency: orderDetails.order_currency || "INR",
            message: "Order amount mismatch detected",
          };
        }

        return {
          success: true,
          orderId: orderDetails.order_id,
          cashfreeOrderId,
          paymentId: `cf_paid_${orderDetails.cf_order_id || cashfreeOrderId}`,
          status: "PAID",
          rawStatus: "PAID",
          amountPaise,
          currency: orderDetails.order_currency || "INR",
          message: "Order marked as PAID by Cashfree",
        };
      } else if (orderDetails?.order_status === "EXPIRED") {
        return {
          success: false,
          orderId: orderDetails.order_id,
          cashfreeOrderId,
          status: "FAILED",
          rawStatus: "EXPIRED",
          amountPaise: rupeesToPaise(orderDetails.order_amount),
          currency: orderDetails.order_currency || "INR",
          message: "Payment session expired",
        };
      }
    } catch (orderErr) {
      console.warn(`[Cashfree Payment] Direct order check for ${cashfreeOrderId} returned:`, orderErr);
    }

    // If no successful payment, check for pending or failed attempts
    const latestPayment = payments[payments.length - 1];
    const rawStatus = latestPayment?.payment_status || "PENDING";
    const status = this.normalizePaymentStatus(rawStatus);

    return {
      success: false,
      orderId: cashfreeOrderId,
      cashfreeOrderId,
      paymentId: latestPayment ? String(latestPayment.cf_payment_id) : undefined,
      status,
      rawStatus,
      amountPaise: latestPayment ? rupeesToPaise(latestPayment.payment_amount) : 0,
      currency: latestPayment?.payment_currency || "INR",
      message: latestPayment?.payment_message || "No successful payment found",
    };
  }

  /**
   * Initiates a refund for an order in Cashfree.
   */
  static async createRefund({
    cashfreeOrderId,
    amountPaise,
    refundId,
    refundNote,
  }: {
    cashfreeOrderId: string;
    amountPaise: number;
    refundId: string;
    refundNote?: string;
  }): Promise<{ refundId: string; status: string }> {
    if (!cashfreeOrderId) {
      throw new Error("Cashfree order ID is required to initiate a refund");
    }

    const refundAmount = paiseToRupees(amountPaise);

    const response = await cashfreeRequest<{
      cf_refund_id: string | number;
      refund_id: string;
      refund_status: string;
    }>(`/orders/${encodeURIComponent(cashfreeOrderId)}/refunds`, {
      method: "POST",
      body: JSON.stringify({
        refund_amount: refundAmount,
        refund_id: refundId,
        refund_note: refundNote || "Order cancellation refund",
        refund_speed: "STANDARD",
      }),
    });

    return {
      refundId: String(response.cf_refund_id || response.refund_id),
      status: response.refund_status?.toLowerCase() || "pending",
    };
  }
}
