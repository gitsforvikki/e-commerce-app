import "server-only";
import { getCashfreeConfig } from "@/lib/payment/cashfree.config";
import {
  formatCashfreePhone,
  paiseToRupees,
} from "@/lib/payment/cashfree.utils";
import type {
  CashfreeCreateOrderRequest,
  CashfreeCreateOrderResponse,
  CashfreeOrderDetailsResponse,
  CreateCashfreeOrderInput,
  CreateCashfreeOrderResult,
} from "@/lib/payment/cashfree.types";
import { cashfreeRequest } from "./cashfree.client";

/**
 * Dedicated service for interacting with Cashfree Order APIs.
 * Encapsulates Cashfree-specific order payload generation and returns safe data.
 */
export class CashfreeOrderService {
  /**
   * Creates a Cashfree payment order on the server.
   *
   * @param input.orderId - The local ShopHub MongoDB Order ID
   * @param input.amountPaise - Order total amount in paise (integer)
   * @param input.currency - Currency code (default: "INR")
   * @param input.customer - Customer details required by Cashfree
   * @param input.returnUrl - Application URL to return to after checkout
   */
  static async createOrder(
    input: CreateCashfreeOrderInput,
  ): Promise<CreateCashfreeOrderResult> {
    const config = getCashfreeConfig();

    if (!input.orderId) {
      throw new Error("Order ID is required to create a Cashfree order");
    }

    const orderAmount = paiseToRupees(input.amountPaise);
    if (orderAmount <= 0) {
      throw new Error("Order amount must be greater than zero");
    }

    // Cashfree order_id: 3 to 45 alphanumeric characters, hyphen and underscore allowed.
    // We use the 24-character MongoDB orderId directly or with 'ord_' prefix
    const cashfreeOrderId = input.orderId.startsWith("ord_")
      ? input.orderId
      : `ord_${input.orderId}`;

    const sanitizedPhone = formatCashfreePhone(input.customer.phone);
    const sanitizedEmail = input.customer.email?.trim() || "customer@shophub.com";
    const sanitizedName = input.customer.name?.trim() || "ShopHub Customer";

    const payload: CashfreeCreateOrderRequest = {
      order_id: cashfreeOrderId,
      order_amount: orderAmount,
      order_currency: input.currency || "INR",
      customer_details: {
        customer_id: input.customer.id || input.orderId,
        customer_name: sanitizedName,
        customer_email: sanitizedEmail,
        customer_phone: sanitizedPhone,
      },
      order_note: `ShopHub Order ${input.orderId}`,
    };

    if (input.returnUrl) {
      payload.order_meta = {
        return_url: input.returnUrl,
      };
    }

    const response = await cashfreeRequest<CashfreeCreateOrderResponse>(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (!response.payment_session_id) {
      throw new Error(
        "Cashfree order creation succeeded but no payment_session_id was returned",
      );
    }

    return {
      orderId: input.orderId,
      cashfreeOrderId: response.order_id,
      paymentSessionId: response.payment_session_id,
      orderAmount: response.order_amount,
      orderCurrency: response.order_currency,
      environment: config.environment,
    };
  }

  /**
   * Fetches an existing Cashfree order entity by Cashfree order_id.
   */
  static async getOrder(
    cashfreeOrderId: string,
  ): Promise<CashfreeOrderDetailsResponse> {
    if (!cashfreeOrderId) {
      throw new Error("Cashfree order ID is required");
    }

    return cashfreeRequest<CashfreeOrderDetailsResponse>(
      `/orders/${encodeURIComponent(cashfreeOrderId)}`,
      {
        method: "GET",
      },
    );
  }
}
