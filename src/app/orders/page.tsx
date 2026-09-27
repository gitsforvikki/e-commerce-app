import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order-model";
import { getCurrentUserData } from "@/services/user/user.service";
import { formatInr } from "@/services/order/pricing.service";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const user = await getCurrentUserData();
  if (!user) redirect("/login");
  await connectDB();
  const orders = await Order.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">My orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-8 text-center">
          <p className="mb-4 text-slate-600">
            You have not placed any orders yet.
          </p>
          <Link href="/" className="font-semibold text-violet-700">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order._id.toString()}
              className="rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-semibold">
                    Order {order._id.toString()}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatInr(order.totalAmount)}</p>
                  <p className="mt-1 text-sm">
                    {order.status} · Payment{" "}
                    {order.payment.status.toLowerCase()}
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <li
                    key={item.productId.toString()}
                    className="flex justify-between gap-4 py-3 text-sm"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>{formatInr(item.pricePaise * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/payment?orderId=${order._id.toString()}`}
                className="mt-2 inline-block text-sm font-semibold text-violet-700"
              >
                View order status
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
