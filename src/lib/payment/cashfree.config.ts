import "server-only";
import {
  CASHFREE_API_VERSION,
  CASHFREE_PRODUCTION_BASE_URL,
  CASHFREE_SANDBOX_BASE_URL,
} from "./cashfree.constants";
import type { CashfreeConfig, CashfreeEnvironment } from "./cashfree.types";

/**
 * Validates and retrieves server-only Cashfree credentials and runtime configuration.
 * CASHFREE_SECRET_KEY is never exported to client-accessible scopes.
 */
export function getCashfreeConfig(): CashfreeConfig {
  const rawAppId = process.env.CASHFREE_APP_ID?.trim() || "";
  const rawSecretKey = process.env.CASHFREE_SECRET_KEY?.trim() || "";
  const rawEnv = (process.env.CASHFREE_ENVIRONMENT?.trim().toLowerCase() || "sandbox");

  const cleanAppId = rawAppId.replace(/^["']|["']$/g, "").trim();
  const cleanSecretKey = rawSecretKey.replace(/^["']|["']$/g, "").trim();

  if (!cleanAppId) {
    throw new Error(
      "Cashfree App ID is missing. Please set CASHFREE_APP_ID in your environment variables.",
    );
  }

  if (!cleanSecretKey) {
    throw new Error(
      "Cashfree Secret Key is missing. Please set CASHFREE_SECRET_KEY in your environment variables.",
    );
  }

  const environment: CashfreeEnvironment =
    rawEnv === "production" ? "production" : "sandbox";

  const isSandbox = environment === "sandbox";
  const baseUrl = isSandbox
    ? CASHFREE_SANDBOX_BASE_URL
    : CASHFREE_PRODUCTION_BASE_URL;

  return {
    appId: cleanAppId,
    secretKey: cleanSecretKey,
    environment,
    baseUrl,
    apiVersion: CASHFREE_API_VERSION,
    isSandbox,
  };
}

/**
 * Helper to check whether Cashfree is configured in the environment.
 */
export function isCashfreeConfigured(): boolean {
  return Boolean(
    process.env.CASHFREE_APP_ID?.trim() &&
    process.env.CASHFREE_SECRET_KEY?.trim(),
  );
}
