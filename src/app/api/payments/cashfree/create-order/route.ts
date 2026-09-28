import { requireUser } from "@/lib/access-control";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import {
  attachProviderOrder,
  createOrderService,
} from "@/services/order/createOrder.service";
import { CashfreeOrderService } from "@/services/payment/cashfree/cashfree.order.service";
import { shippingAddressValidator } from "@/validators/shippingAddressValidator";
import { CashfreeApiError } from "@/services/payment/cashfree/cashfree.client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    // Parse any optional custom shipping address provided in body, or fallback to user profile address
    let bodyAddress: unknown = null;
    try {
      const body = (await request.json()) as { shippingAddress?: unknown };
      bodyAddress = body?.shippingAddress;
    } catch {
      // Body is empty or not JSON; fallback to profile address
    }

    const candidateAddress = bodyAddress || {
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      phone: user.phone == null ? "" : String(user.phone),
      home: user.address?.home ?? "",
      city: user.address?.city ?? "",
      state: user.address?.state ?? "",
      pincode:
        user.address?.pincode == null
          ? ""
          : String(user.address.pincode).padStart(6, "0"),
    };

    const parsedAddress = shippingAddressValidator.safeParse(candidateAddress);
    if (!parsedAddress.success) {
      return Response.json(
        {
          success: false,
          message:
            "Please complete a valid 6-digit pincode and shipping address in your profile before checkout.",
          errors: parsedAddress.error.format(),
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Clean up stale uncompleted pending orders older than 15 minutes
    const staleCutoff = new Date(Date.now() - 15 * 60 * 1000);
    await Order.updateMany(
      {
        userId: user._id,
        status: "CREATED",
        "payment.status": "PENDING",
        createdAt: { $lt: staleCutoff },
      },
      {
        $set: {
          status: "CANCELLED",
          "payment.status": "FAILED",
        },
      },
    );

    // Create a new local shop order with server-calculated amounts from DB cart
    const order = await createOrderService({
      userId: user._id.toString(),
      shippingAddress: parsedAddress.data,
      paymentMethod: "Cashfree",
    });

    // Derive application origin for return URL (supports Vercel proxies and localhost)
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const rawProto = request.headers.get("x-forwarded-proto");
    const proto = rawProto
      ? rawProto.split(",")[0].trim()
      : host?.includes("localhost")
      ? "http"
      : "https";
    const origin = host ? `${proto}://${host}` : new URL(request.url).origin;
    const returnUrl = `${origin}/payment?order_id={order_id}&local_order_id=${order._id.toString()}`;

    // Create the Cashfree Sandbox Payment Order
    try {
      const cashfreeOrder = await CashfreeOrderService.createOrder({
        orderId: order._id.toString(),
        amountPaise: order.totalAmount,
        currency: order.currency,
        customer: {
          id: user._id.toString(),
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer",
          email: user.email,
          phone: String(user.phone || parsedAddress.data.phone || "9999999999"),
        },
        returnUrl,
      });

      // Save Cashfree order ID to local order
      await attachProviderOrder(order._id.toString(), cashfreeOrder.cashfreeOrderId);

      return Response.json({
        success: true,
        orderId: order._id.toString(),
        cashfreeOrderId: cashfreeOrder.cashfreeOrderId,
        paymentSessionId: cashfreeOrder.paymentSessionId,
        amount: cashfreeOrder.orderAmount,
        currency: cashfreeOrder.orderCurrency,
        environment: cashfreeOrder.environment,
        isSandbox: cashfreeOrder.environment === "sandbox",
      });
    } catch (paymentProviderError) {
      // Mark local order cancelled if Cashfree gateway creation failed
      await Order.updateOne(
        { _id: order._id },
        { $set: { status: "CANCELLED", "payment.status": "FAILED" } },
      );

      if (paymentProviderError instanceof CashfreeApiError) {
        const message =
          paymentProviderError.statusCode === 401
            ? "Cashfree authentication failed. Please verify that CASHFREE_APP_ID and CASHFREE_SECRET_KEY in your .env file are valid Sandbox API keys."
            : paymentProviderError.message;

        return Response.json(
          {
            success: false,
            message,
          },
          { status: 502 },
        );
      }

      throw paymentProviderError;
    }
  } catch (error) {
    console.error("[Cashfree Create Order Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unable to initiate payment";
    const isUserAuthError =
      error instanceof Error &&
      (error.name === "AccessDeniedError" ||
        errorMessage.toLowerCase().includes("authentication required") ||
        errorMessage.toLowerCase().includes("please define jwt_secret"));
    const isClientError =
      errorMessage.toLowerCase().includes("cart is empty") ||
      errorMessage.toLowerCase().includes("stock") ||
      errorMessage.toLowerCase().includes("available") ||
      errorMessage.toLowerCase().includes("address");

    return Response.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: isUserAuthError ? 401 : isClientError ? 400 : 500 },
    );
  }
}
