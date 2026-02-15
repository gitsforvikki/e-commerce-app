interface Props {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function PaymentPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) return <div>orderId not found</div>;

  return (
    <div className="max-w-xl mx-auto mt-20 text-center space-y-6">
      <h1 className="text-3xl font-bold">Complete Payment</h1>

      <p className="text-gray-600">
        Order ID: <span className="font-mono">{orderId}</span>
      </p>

      <button className="bg-violet-600 text-white px-6 py-3 rounded-lg">
        Pay Now
      </button>
    </div>
  );
}
