export const ORDER_CURRENCY = "INR" as const;
const TAX_RATE_BPS = 1_000;
const FREE_SHIPPING_THRESHOLD_PAISE = 100_000;
const SHIPPING_FEE_PAISE = 5_000;

export interface OrderPricing {
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: typeof ORDER_CURRENCY;
}

export function calculateOrderPricing(
  items: Array<{ price: number; qty: number }>,
): OrderPricing {
  const subtotalAmount = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0,
  );
  const taxAmount = Math.round((subtotalAmount * TAX_RATE_BPS) / 10_000);
  const shippingAmount =
    subtotalAmount > 0 && subtotalAmount < FREE_SHIPPING_THRESHOLD_PAISE
      ? SHIPPING_FEE_PAISE
      : 0;

  return {
    subtotalAmount,
    taxAmount,
    shippingAmount,
    totalAmount: subtotalAmount + taxAmount + shippingAmount,
    currency: ORDER_CURRENCY,
  };
}

export function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: ORDER_CURRENCY,
  }).format(paise / 100);
}
