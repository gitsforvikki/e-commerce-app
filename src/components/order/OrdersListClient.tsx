"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { formatInr } from "@/services/order/pricing.service";
import {
  Package,
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export type SerializedOrderItem = {
  id: string;
  name: string;
  qty: number;
  pricePaise: number;
  image?: string;
};

export type SerializedOrder = {
  id: string;
  status: "CREATED" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  createdAt: string;
  payment: {
    status: "PENDING" | "SUCCESS" | "FAILED" | string;
    method?: string;
    paymentId?: string;
  };
  shippingAddress: {
    name: string;
    phone: string;
    home: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  items: SerializedOrderItem[];
};

interface OrdersListClientProps {
  initialOrders: SerializedOrder[];
}

export function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Summary Metrics
  const stats = useMemo(() => {
    const totalOrders = initialOrders.length;
    const completed = initialOrders.filter((o) => o.status === "DELIVERED").length;
    const inProgress = initialOrders.filter(
      (o) =>
        o.status === "CREATED" ||
        o.status === "CONFIRMED" ||
        o.status === "PAID" ||
        o.status === "PROCESSING" ||
        o.status === "SHIPPED",
    ).length;
    const totalSpentPaise = initialOrders
      .filter(
        (o) =>
          o.status !== "CANCELLED" &&
          (o.payment.status === "SUCCESS" || o.payment.status === "PAID"),
      )
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalOrders, completed, inProgress, totalSpentPaise };
  }, [initialOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // Status filtering
      if (statusFilter === "COMPLETED" && order.status !== "DELIVERED") return false;
      if (
        statusFilter === "IN_PROGRESS" &&
        !["CREATED", "CONFIRMED", "PAID", "PROCESSING", "SHIPPED"].includes(
          order.status,
        )
      ) {
        return false;
      }
      if (statusFilter === "CANCELLED" && order.status !== "CANCELLED") return false;

      // Search query filtering
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(query);
      const matchesItem = order.items.some((item) =>
        item.name.toLowerCase().includes(query),
      );
      const matchesCity = order.shippingAddress?.city.toLowerCase().includes(query);
      return matchesId || matchesItem || matchesCity;
    });
  }, [initialOrders, statusFilter, searchQuery]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getOrderStatusConfig = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return {
          label: "Delivered",
          icon: CheckCircle2,
          badgeClass:
            "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
          step: 4,
        };
      case "SHIPPED":
        return {
          label: "Shipped",
          icon: Truck,
          badgeClass:
            "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
          step: 3,
        };
      case "PROCESSING":
      case "PAID":
        return {
          label: "Processing",
          icon: Clock,
          badgeClass:
            "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
          step: 2,
        };
      case "CONFIRMED":
        return {
          label: "Confirmed",
          icon: CheckCircle2,
          badgeClass:
            "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
          step: 2,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          icon: XCircle,
          badgeClass:
            "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
          step: 0,
        };
      case "CREATED":
      default:
        return {
          label: "Order Placed",
          icon: Package,
          badgeClass:
            "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200/80 dark:border-violet-800/60",
          step: 1,
        };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "PAID":
        return {
          label: "Payment Verified",
          icon: ShieldCheck,
          badgeClass:
            "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
        };
      case "FAILED":
        return {
          label: "Payment Failed",
          icon: AlertTriangle,
          badgeClass:
            "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
        };
      case "PENDING":
      default:
        return {
          label: "Payment Pending",
          icon: AlertCircle,
          badgeClass:
            "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalOrders}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Lifetime purchases
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.inProgress}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Processing or shipped
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.completed}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Completed deliveries
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {formatInr(stats.totalSpentPaise)}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Verified purchases
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: `All (${initialOrders.length})` },
            { id: "IN_PROGRESS", label: `In Progress (${stats.inProgress})` },
            { id: "COMPLETED", label: `Delivered (${stats.completed})` },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or item name…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {searchQuery || statusFilter !== "ALL"
                ? "No matching orders found"
                : "No orders placed yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter !== "ALL"
                ? "Try clearing your filters or changing the search keyword to find what you're looking for."
                : "When you place an order, you can review receipt details, track shipments, and request returns right here."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery || statusFilter !== "ALL" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href={routes.PRODUCTS}
                className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/25 transition-all inline-flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Start Shopping</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const orderConfig = getOrderStatusConfig(order.status);
            const paymentConfig = getPaymentStatusConfig(order.payment.status);
            const OrderIcon = orderConfig.icon;
            const PaymentIcon = paymentConfig.icon;
            const isExpanded = expandedOrders[order.id] ?? true;
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <article
                key={order.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Header Banner */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Order ID & Date */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          #ORD-{order.id.slice(-8).toUpperCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(order.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          title="Copy Full Order ID"
                        >
                          {copiedId === order.id ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Placed on {orderDate}</span>
                      </div>
                    </div>

                    {/* Right: Badges & Amount */}
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      {/* Order Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${orderConfig.badgeClass}`}
                      >
                        <OrderIcon size={13} />
                        <span>{orderConfig.label}</span>
                      </span>

                      {/* Payment Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${paymentConfig.badgeClass}`}
                      >
                        <PaymentIcon size={13} />
                        <span>{paymentConfig.label}</span>
                      </span>

                      {/* Total Amount */}
                      <div className="pl-2 border-l border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                          Total
                        </p>
                        <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {formatInr(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracker (If not cancelled) */}
                  {order.status !== "CANCELLED" && (
                    <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 dark:bg-slate-700 -z-0" />
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-violet-600 transition-all duration-500 -z-0"
                          style={{
                            width:
                              orderConfig.step === 1
                                ? "15%"
                                : orderConfig.step === 2
                                ? "48%"
                                : orderConfig.step === 3
                                ? "80%"
                                : "100%",
                          }}
                        />

                        {[
                          { step: 1, label: "Placed" },
                          { step: 2, label: "Confirmed" },
                          { step: 3, label: "Shipped" },
                          { step: 4, label: "Delivered" },
                        ].map((s) => {
                          const isDone = orderConfig.step >= s.step;
                          const isCurrent = orderConfig.step === s.step;

                          return (
                            <div
                              key={s.step}
                              className="relative z-10 flex flex-col items-center"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isDone
                                    ? "bg-violet-600 text-white ring-4 ring-violet-100 dark:ring-violet-950/60 shadow-xs"
                                    : "bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                {isDone ? <Check size={12} strokeWidth={3} /> : s.step}
                              </div>
                              <span
                                className={`text-[11px] font-bold mt-1.5 ${
                                  isCurrent
                                    ? "text-violet-600 dark:text-violet-400"
                                    : isDone
                                    ? "text-slate-800 dark:text-slate-200"
                                    : "text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Section */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Purchased Items ({order.items.length})
                    </p>
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? "Collapse" : "Show All"}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {order.items.map((item, idx) => {
                        const itemTotal = item.pricePaise * item.qty;

                        return (
                          <div
                            key={`${item.id}-${idx}`}
                            className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Product Thumbnail */}
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shrink-0 flex items-center justify-center">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package size={20} className="text-slate-400" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1">
                                  {item.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:text-slate-300">
                                    Qty: {item.qty}
                                  </span>
                                  <span>•</span>
                                  <span>Unit Price: {formatInr(item.pricePaise)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Item Total Price */}
                            <div className="text-right shrink-0">
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                                {formatInr(itemTotal)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Section: Shipping Address & Action Bar */}
                <div className="bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Delivery Location Snippet */}
                  {order.shippingAddress ? (
                    <div className="flex items-start gap-2.5 max-w-md">
                      <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Shipping to {order.shippingAddress.name}:
                        </span>{" "}
                        <span>
                          {[
                            order.shippingAddress.home,
                            order.shippingAddress.city,
                            order.shippingAddress.state,
                            order.shippingAddress.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">
                      Standard delivery address
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <Link
                      href={`/payment?orderId=${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/50 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold text-xs border border-violet-200/70 dark:border-violet-800/60 transition-colors shadow-xs"
                    >
                      <ExternalLink size={13} />
                      <span>Order Receipt & Status</span>
                    </Link>

                    <Link
                      href={routes.PRODUCTS}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors shadow-xs"
                    >
                      <RotateCcw size={13} />
                      <span>Buy Again</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
