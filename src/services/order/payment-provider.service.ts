import { createHmac, timingSafeEqual } from "node:crypto";
import { ORDER_CURRENCY } from "@/services/order/pricing.service";

const API_BASE = "https://api.razorpay.com/v1";

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Payment provider is not configured");
  }
  return { keyId, keySecret };
}

async function providerRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const details = await response.text();
    console.error("Payment provider request failed", response.status, details);
    throw new Error("Payment provider request failed");
  }
  return response.json() as Promise<T>;
}

export async function createProviderOrder(amount: number, receipt: string) {
  const { keyId } = credentials();
  const order = await providerRequest<{
    id: string;
    amount: number;
    currency: string;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify({ amount, currency: ORDER_CURRENCY, receipt }),
  });
  if (order.amount !== amount || order.currency !== ORDER_CURRENCY) {
    throw new Error("Payment provider returned an unexpected order amount");
  }
  return { ...order, keyId };
}

export function verifyCheckoutSignature(input: {
  providerOrderId: string;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = credentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${input.providerOrderId}|${input.paymentId}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(input.signature, "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function fetchProviderPayment(paymentId: string) {
  return providerRequest<{
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
  }>(`/payments/${encodeURIComponent(paymentId)}`);
}

export async function refundProviderPayment(
  paymentId: string,
  amount: number,
  orderId: string,
) {
  return providerRequest<{ id: string; status: string }>(
    `/payments/${encodeURIComponent(paymentId)}/refund`,
    {
      method: "POST",
      headers: {
        "X-Razorpay-Idempotency-Key": `shop-refund-${orderId}-${paymentId}`,
      },
      body: JSON.stringify({ amount, notes: { orderId } }),
    },
  );
}

export function verifyWebhookSignature(body: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
