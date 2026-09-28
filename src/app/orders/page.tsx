import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { getCurrentUserData } from "@/services/user/user.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { ChevronRight, Package, ShieldCheck } from "lucide-react";
import {
  OrdersListClient,
  type SerializedOrder,
} from "@/components/order/OrdersListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders & Order History | ShopHub",
  description:
    "Track active shipments, view past purchases, download receipts, and manage your ShopHub orders.",
};

export default async function OrdersPage() {
  const user = await getCurrentUserData();
  if (!user) redirect(routes.LOGIN);

  await connectDB();
  const rawOrders = await Order.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize orders for the client component
  const serializedOrders: SerializedOrder[] = rawOrders.map((order) => {
    const rawItems = (order.items || []) as Array<{
      productId?: { toString(): string };
      name: string;
      qty: number;
      pricePaise?: number;
      price?: number;
      image?: string;
    }>;

    const items = rawItems.map((item) => ({
      id: item.productId?.toString() || Math.random().toString(),
      name: item.name || "Product",
      qty: item.qty || 1,
      pricePaise:
        typeof item.pricePaise === "number"
          ? item.pricePaise
          : typeof item.price === "number"
          ? Math.round(item.price * 100)
          : 0,
      image: item.image || "",
    }));

    return {
      id: order._id.toString(),
      status: order.status || "CREATED",
      totalAmount: order.totalAmount || 0,
      subtotalAmount: order.subtotalAmount || 0,
      taxAmount: order.taxAmount || 0,
      shippingAmount: order.shippingAmount || 0,
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : new Date().toISOString(),
      payment: {
        status: order.payment?.status || "PENDING",
        method: order.payment?.method || "Cashfree",
        paymentId: order.payment?.paymentId || order.payment?.cashfreePaymentId,
      },
      shippingAddress: order.shippingAddress
        ? {
            name: order.shippingAddress.name || "",
            phone: order.shippingAddress.phone || "",
            home: order.shippingAddress.home || "",
            city: order.shippingAddress.city || "",
            state: order.shippingAddress.state || "",
            pincode: String(order.shippingAddress.pincode || ""),
          }
        : null,
      items,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href={routes.HOME}
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={14} className="shrink-0 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-bold">
            My Orders
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold mb-1">
              <Package size={14} />
              <span>Purchase History & Deliveries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Track real-time shipment status, review purchase invoices, and easily reorder your favorite items.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-xs self-start md:self-auto shrink-0">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Verified Purchase Records</span>
          </div>
        </div>

        {/* Interactive Orders List Component */}
        <OrdersListClient initialOrders={serializedOrders} />
      </div>
    </div>
  );
}
