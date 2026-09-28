import { getCurrentUserData } from "@/services/user/user.service";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { formatInr } from "@/services/order/pricing.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/utils/routes";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Types } from "mongoose";
import { CashfreePaymentService } from "@/services/payment/cashfree/cashfree.payment.service";
import { settleOrRefundCapturedOrder } from "@/services/order/createOrder.service";
import { CartSyncOnSuccess } from "@/components/cart/CartSyncOnSuccess";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    orderId?: string;
    order_id?: string;
    local_order_id?: string;
  }>;
}

export const metadata = {
  title: "Order Payment Status | ShopHub",
  description: "View and verify your Cashfree Sandbox order payment confirmation status.",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({ searchParams }: Props) {
  const user = await getCurrentUserData();
  if (!user) redirect(routes.LOGIN);

  const params = await searchParams;
  const targetId = params.orderId || params.local_order_id;
  const cashfreeOrderId = params.order_id;

  if (!targetId && !cashfreeOrderId) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-4">
          <AlertTriangle size={48} className="mx-auto text-amber-500" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Order Reference Missing
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No order identifier was found in your payment callback.
          </p>
          <Link
            href={routes.ORDER}
            className="inline-block px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
          >
            Go to My Orders
          </Link>
        </div>
      </main>
    );
  }

  await connectDB();

  // Find local order
  const query: Record<string, unknown> = {
    userId: new Types.ObjectId(user.userId),
  };

  if (targetId && Types.ObjectId.isValid(targetId)) {
    query._id = new Types.ObjectId(targetId);
  } else if (cashfreeOrderId) {
    query.$or = [
      { "payment.cashfreeOrderId": cashfreeOrderId },
      { "payment.providerOrderId": cashfreeOrderId },
    ];
  }

  let order = await Order.findOne(query);

  if (!order) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-4">
          <AlertTriangle size={48} className="mx-auto text-rose-500" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Order Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We could not find an order matching this payment record in your account.
          </p>
          <Link
            href={routes.ORDER}
            className="inline-block px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20"
          >
            Review Past Orders
          </Link>
        </div>
      </main>
    );
  }

  // If order is still pending, perform server-side payment verification against Cashfree Sandbox
  const isAlreadyPaid =
    order.payment.status === "SUCCESS" || order.payment.status === "PAID";

  if (!isAlreadyPaid) {
    const cfId =
      order.payment.cashfreeOrderId ||
      order.payment.providerOrderId ||
      cashfreeOrderId;

    if (cfId) {
      try {
        const verifyResult = await CashfreePaymentService.verifyOrderPayment({
          cashfreeOrderId: cfId,
          expectedAmountPaise: order.totalAmount,
        });

        if (verifyResult.success && verifyResult.status === "PAID") {
          await settleOrRefundCapturedOrder({
            orderId: order._id.toString(),
            providerOrderId: cfId,
            paymentId: verifyResult.paymentId || "cf_sandbox_success",
            paymentMethod: "Cashfree",
          });

          // Reload updated order document
          const refreshed = await Order.findById(order._id);
          if (refreshed) order = refreshed;
        } else if (verifyResult.status === "FAILED") {
          await Order.updateOne(
            { _id: order._id, "payment.status": "PENDING", status: "CREATED" },
            { $set: { "payment.status": "FAILED", status: "CANCELLED" } },
          );
          const refreshed = await Order.findById(order._id);
          if (refreshed) order = refreshed;
        }
      } catch (verifyError) {
        console.error("[Payment Page] Verification error:", verifyError);
      }
    }
  }

  const isRefunded =
    order.status === "CANCELLED" &&
    (order.payment.refundStatus === "PROCESSED" ||
      order.payment.refundStatus === "PENDING");

  const isConfirmed =
    (order.payment.status === "SUCCESS" || order.payment.status === "PAID") &&
    order.status !== "CANCELLED";

  const isFailed =
    !isConfirmed &&
    !isRefunded &&
    (order.payment.status === "FAILED" || order.status === "CANCELLED");

  return (
    <div className="min-h-[calc(100vh-16rem)] bg-slate-50/60 dark:bg-slate-950 py-10 sm:py-16 transition-colors duration-200">
      <CartSyncOnSuccess shouldSync={isConfirmed} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Status Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-4 relative overflow-hidden">
          {isConfirmed ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={36} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/40">
                <ShieldCheck size={13} />
                <span>Cashfree Sandbox Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Payment Confirmed & Order Placed!
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Thank you! Your Sandbox test payment was verified successfully by the server. Your items are being prepared for dispatch.
              </p>
            </>
          ) : isRefunded ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                <AlertTriangle size={36} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Order Cancelled — Full Refund Initiated
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Payment was captured, but some items became out of stock during checkout. A full refund has been initiated to your original payment method.
              </p>
            </>
          ) : isFailed ? (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/10">
                <AlertTriangle size={36} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Payment Not Completed
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                The transaction was either cancelled or dropped in the Cashfree Sandbox gateway. No amount was deducted.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Clock size={36} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Payment Awaiting Confirmation
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                We are currently awaiting final webhook notification from the Cashfree payment gateway. If you completed payment, do not pay again.
              </p>
            </>
          )}
        </div>

        {/* Order Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Order Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  #{order._id.toString()}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isConfirmed
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  : isFailed
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                  : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <CreditCard size={14} />
                <span>Payment Reference</span>
              </div>
              <p className="font-mono text-slate-900 dark:text-white font-bold truncate">
                {order.payment.paymentId ||
                  order.payment.cashfreePaymentId ||
                  "Pending settlement"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gateway: {order.payment.method || "Cashfree Sandbox"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <ShoppingBag size={14} />
                <span>Amount Paid</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {formatInr(order.totalAmount)}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Status: {order.payment.status}
              </p>
            </div>
          </div>

          {/* Shipping Address Summary */}
          {order.shippingAddress && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <MapPin size={14} />
                <span>Shipping Address</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">
                {order.shippingAddress.name} ({order.shippingAddress.phone})
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingAddress.home}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          )}

          {/* Items Purchased Preview */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Purchased Items ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Qty: {item.qty} × {formatInr(item.pricePaise)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      {formatInr(item.pricePaise * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {isFailed ? (
            <Link
              href={routes.CHECKOUT}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-violet-600/20"
            >
              <span>Retry Checkout</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              href={routes.ORDER}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-violet-600/20"
            >
              <span>View All Orders</span>
              <ArrowRight size={16} />
            </Link>
          )}

          <Link
            href={routes.HOME}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-colors"
          >
            <span>Continue Shopping</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
