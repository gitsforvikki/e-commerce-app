import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { settleOrRefundCapturedOrder } from "@/services/order/createOrder.service";
import { verifyWebhookSignature } from "@/services/order/payment-provider.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifyWebhookSignature(rawBody, signature)) {
    return Response.json(
      { message: "Invalid webhook signature" },
      { status: 401 },
    );
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
          };
        };
      };
    };
    if (event.event !== "payment.captured")
      return Response.json({ received: true });

    const payment = event.payload?.payment?.entity;
    if (
      !payment?.id ||
      !payment.order_id ||
      payment.status !== "captured" ||
      !Number.isInteger(payment.amount) ||
      !payment.currency
    ) {
      return Response.json(
        { message: "Invalid captured payment payload" },
        { status: 400 },
      );
    }

    await connectDB();
    const order = await Order.findOne({
      "payment.providerOrderId": payment.order_id,
    });
    if (!order)
      return Response.json({ message: "Order not found" }, { status: 404 });
    if (
      payment.amount !== order.totalAmount ||
      payment.currency !== order.currency
    ) {
      return Response.json(
        { message: "Payment amount does not match order" },
        { status: 400 },
      );
    }

    await settleOrRefundCapturedOrder({
      orderId: order._id.toString(),
      providerOrderId: payment.order_id,
      paymentId: payment.id,
    });
    return Response.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed", error);
    return Response.json(
      { message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
