import "server-only";
import { getCashfreeConfig } from "@/lib/payment/cashfree.config";
import { CASHFREE_HEADERS } from "@/lib/payment/cashfree.constants";

export class CashfreeApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "CashfreeApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Reusable HTTP client for communicating with the Cashfree Payment Gateway API.
 * Automatically injects authentication headers, base URL, and API version.
 * Ensures secrets are never exposed in logs or client-facing responses.
 */
export async function cashfreeRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    [CASHFREE_HEADERS.CLIENT_ID]: config.appId,
    [CASHFREE_HEADERS.CLIENT_SECRET]: config.secretKey,
    [CASHFREE_HEADERS.API_VERSION]: config.apiVersion,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const method = options.method?.toUpperCase() || "GET";

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (networkError) {
    console.error(`[Cashfree] Network error while connecting to ${method} ${path}`, networkError);
    throw new CashfreeApiError(
      "Unable to connect to Cashfree payment gateway. Please check your internet connection.",
      503,
    );
  }

  const responseText = await response.text();
  let parsedData: unknown = null;

  if (responseText) {
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = responseText;
    }
  }

  if (!response.ok) {
    const errorMessage =
      typeof parsedData === "object" && parsedData !== null && "message" in parsedData
        ? String((parsedData as { message: unknown }).message)
        : `Cashfree API returned HTTP status ${response.status}`;

    console.error(
      `[Cashfree] Request failed: ${method} ${path} -> Status: ${response.status}`,
      typeof parsedData === "object" ? JSON.stringify(parsedData) : parsedData,
    );

    throw new CashfreeApiError(errorMessage, response.status, parsedData);
  }

  return parsedData as T;
}
