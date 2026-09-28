import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies the authenticity of Cashfree webhook notifications.
 * Cashfree signature algorithm:
 * HMAC-SHA256(timestamp + rawBody, secretKey) encoded as Base64 string.
 *
 * @param rawBody - Raw unparsed HTTP request body string.
 * @param timestamp - Header `x-webhook-timestamp`
 * @param signature - Header `x-webhook-signature`
 * @param secretKey - Merchant secret key from Cashfree config
 */
export function verifyCashfreeWebhookSignature({
  rawBody,
  timestamp,
  signature,
  secretKey,
}: {
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
  secretKey: string;
}): boolean {
  if (!rawBody || !timestamp || !signature || !secretKey) {
    return false;
  }

  try {
    const signedPayload = `${timestamp}${rawBody}`;
    const expectedSignature = createHmac("sha256", secretKey)
      .update(signedPayload)
      .digest("base64");

    const expectedBuffer = Buffer.from(expectedSignature, "utf-8");
    const receivedBuffer = Buffer.from(signature, "utf-8");

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (error) {
    console.error("[Cashfree Signature] Verification failed due to error", error);
    return false;
  }
}

/**
 * Converts integer paise (e.g. 149900) to rupees with 2 decimal places (1499.00).
 */
export function paiseToRupees(paise: number): number {
  if (!Number.isFinite(paise) || paise < 0) {
    throw new Error("Invalid paise amount");
  }
  return Number((paise / 100).toFixed(2));
}

/**
 * Converts rupees float or integer to exact integer paise.
 */
export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees) || rupees < 0) {
    throw new Error("Invalid rupees amount");
  }
  return Math.round(rupees * 100);
}

/**
 * Formats a given phone number to ensure a clean 10-digit Indian phone number
 * acceptable by Cashfree sandbox and production.
 */
export function formatCashfreePhone(rawPhone?: string | number | null): string {
  if (!rawPhone) return "9999999999";
  const cleaned = String(rawPhone).replace(/\D/g, "");
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length > 10) return cleaned.slice(-10);
  return "9999999999";
}
