import { CashfreeWebhookService } from "@/services/payment/cashfree/cashfree.webhook.service";
import { CASHFREE_HEADERS } from "@/lib/payment/cashfree.constants";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get(CASHFREE_HEADERS.WEBHOOK_SIGNATURE);
    const timestamp = request.headers.get(CASHFREE_HEADERS.WEBHOOK_TIMESTAMP);

    if (!rawBody || !signature || !timestamp) {
      console.warn("[Cashfree Webhook Endpoint] Missing signature, timestamp, or raw body.");
      return Response.json(
        { message: "Missing required webhook headers or body" },
        { status: 400 },
      );
    }

    const result = await CashfreeWebhookService.processWebhook({
      rawBody,
      signature,
      timestamp,
    });

    return Response.json({
      received: true,
      ...result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Webhook processing error";
    console.error("[Cashfree Webhook Endpoint Error]", errorMessage);

    if (errorMessage === "INVALID_SIGNATURE") {
      return Response.json(
        { message: "Invalid webhook signature" },
        { status: 401 },
      );
    }

    if (errorMessage === "ORDER_NOT_FOUND") {
      return Response.json(
        { message: "Referenced order not found" },
        { status: 404 },
      );
    }

    if (errorMessage === "AMOUNT_MISMATCH" || errorMessage === "MALFORMED_EVENT_DATA") {
      return Response.json(
        { message: "Invalid event data or amount mismatch" },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "Internal server error processing webhook" },
      { status: 500 },
    );
  }
}
