export const CASHFREE_API_VERSION = "2023-08-01" as const;

export const CASHFREE_SANDBOX_BASE_URL = "https://sandbox.cashfree.com/pg" as const;
export const CASHFREE_PRODUCTION_BASE_URL = "https://api.cashfree.com/pg" as const;

export const CASHFREE_HEADERS = {
  CLIENT_ID: "x-client-id",
  CLIENT_SECRET: "x-client-secret",
  API_VERSION: "x-api-version",
  WEBHOOK_TIMESTAMP: "x-webhook-timestamp",
  WEBHOOK_SIGNATURE: "x-webhook-signature",
  IDEMPOTENCY_KEY: "x-idempotency-key",
} as const;

export const CASHFREE_ORDER_STATUS = {
  ACTIVE: "ACTIVE",
  PAID: "PAID",
  EXPIRED: "EXPIRED",
} as const;

export const CASHFREE_PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  PENDING: "PENDING",
  USER_DROPPED: "USER_DROPPED",
  CANCELLED: "CANCELLED",
} as const;

export const CASHFREE_WEBHOOK_EVENTS = {
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS_WEBHOOK",
  PAYMENT_FAILED: "PAYMENT_FAILED_WEBHOOK",
  PAYMENT_USER_DROPPED: "PAYMENT_USER_DROPPED_WEBHOOK",
} as const;

export const PAYMENT_METHOD_CASHFREE = "Cashfree" as const;
