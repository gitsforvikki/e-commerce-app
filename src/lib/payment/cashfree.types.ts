export type CashfreeEnvironment = "sandbox" | "production";

export interface CashfreeConfig {
  appId: string;
  secretKey: string;
  environment: CashfreeEnvironment;
  baseUrl: string;
  apiVersion: string;
  isSandbox: boolean;
}

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone: string;
}

export interface CashfreeOrderMeta {
  return_url?: string;
  notify_url?: string;
  payment_methods?: string;
}

export interface CashfreeCreateOrderRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CashfreeCustomerDetails;
  order_meta?: CashfreeOrderMeta;
  order_note?: string;
  order_tags?: Record<string, string>;
}

export interface CashfreeCreateOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: "ACTIVE" | "PAID" | "EXPIRED";
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  customer_details?: CashfreeCustomerDetails;
}

export interface CashfreePaymentEntity {
  cf_payment_id: string | number;
  order_id: string;
  entity: string;
  payment_currency: string;
  payment_amount: number;
  payment_time: string;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "CANCELLED";
  payment_message?: string;
  bank_reference?: string;
  auth_id?: string | null;
  payment_method?: Record<string, unknown>;
  payment_group?: string;
}

export interface CashfreeOrderDetailsResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: "ACTIVE" | "PAID" | "EXPIRED";
  payment_session_id?: string;
  customer_details?: CashfreeCustomerDetails;
}

export interface CashfreeWebhookPayload {
  data: {
    order: {
      order_id: string;
      order_amount: number;
      order_currency: string;
      order_tags?: Record<string, string> | null;
    };
    payment: {
      cf_payment_id: string | number;
      payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "CANCELLED" | string;
      payment_amount: number;
      payment_currency: string;
      payment_message?: string;
      payment_time?: string;
      bank_reference?: string;
      auth_id?: string | null;
      payment_method?: Record<string, unknown>;
      payment_group?: string;
    };
    customer_details?: {
      customer_id?: string;
      customer_name?: string | null;
      customer_email?: string | null;
      customer_phone?: string;
    };
  };
  event_time: string;
  type: string;
}

export interface CreateCashfreeOrderInput {
  orderId: string;
  amountPaise: number;
  currency?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  returnUrl?: string;
}

export interface CreateCashfreeOrderResult {
  orderId: string;
  cashfreeOrderId: string;
  paymentSessionId: string;
  orderAmount: number;
  orderCurrency: string;
  environment: CashfreeEnvironment;
}

export interface NormalizedPaymentResult {
  success: boolean;
  orderId: string;
  cashfreeOrderId?: string;
  paymentId?: string;
  status: "PAID" | "PENDING" | "FAILED";
  rawStatus: string;
  amountPaise: number;
  currency: string;
  message?: string;
}
