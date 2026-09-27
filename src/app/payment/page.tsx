import { getOwnedOrder } from "@/server-actions/placeOrder.action";
import { getCurrentUserData } from "@/services/user/user.service";
import { formatInr } from "@/services/order/pricing.service";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentPage({ searchParams }: Props) {
  const user = await getCurrentUserData();
  if (!user) redirect("/login");
  const { orderId } = await searchParams;
  if (!orderId)
    return (
      <main className="mx-auto mt-20 max-w-xl text-center">
        Order not found.
      </main>
    );

  const order = await getOwnedOrder(orderId);
  if (!order)
    return (
      <main className="mx-auto mt-20 max-w-xl text-center">
        Order not found.
      </main>
    );
  const paid = order.payment.status === "SUCCESS";

  return (
    <main className="mx-auto mt-20 max-w-xl space-y-6 px-4 text-center">
      <h1 className="text-3xl font-bold">
        {paid ? "Payment confirmed" : "Payment pending"}
      </h1>
      <p className={paid ? "text-green-700" : "text-amber-700"}>
        {paid
          ? "Your order has been paid and is being processed."
          : "We have not confirmed payment yet. Do not pay again until your payment status is updated."}
      </p>
      <div className="rounded-lg border border-slate-200 p-5 text-left">
        <p>
          Order: <span className="font-mono">{order._id.toString()}</span>
        </p>
        <p className="mt-2">Total: {formatInr(order.totalAmount)}</p>
        <p className="mt-2">Status: {order.status}</p>
      </div>
      <Link
        href="/orders"
        className="inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white"
      >
        View my orders
      </Link>
    </main>
  );
}
