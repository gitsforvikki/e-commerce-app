/**
 * Centralized route configuration for authentication-based access control.
 *
 * Uses a **private-route deny-list** approach: only routes explicitly listed
 * as private or auth-only are restricted. Everything else is public by default.
 * This is safer for an e-commerce site where most pages (products, categories,
 * features, etc.) should be accessible to guests.
 */

/**
 * Routes that require authentication.
 * Unauthenticated users will be redirected to LOGIN_ROUTE with a callbackUrl.
 */
export const PRIVATE_ROUTES: string[] = [
  "/orders",
  "/profile",
  "/checkout",
  "/payment",
  "/product-upload",
];

/**
 * Private route prefixes — any path starting with these requires authentication.
 */
export const PRIVATE_ROUTE_PREFIXES: string[] = [
  "/orders/",
  "/profile/",
  "/checkout/",
  "/payment/",
  "/product-upload/",
];

/**
 * Auth-related pages — only for unauthenticated guests.
 * Authenticated users hitting these routes are redirected to DEFAULT_LOGIN_REDIRECT.
 */
export const AUTH_ROUTES: string[] = [
  "/login",
  "/register",
];

/**
 * Where authenticated users are sent when they try to visit an auth page
 * (e.g. /login while already logged in).
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

/** The login page to redirect unauthenticated users to. */
export const LOGIN_ROUTE = "/login";

/**
 * Determine whether a given pathname requires authentication.
 */
export function isPrivateRoute(pathname: string): boolean {
  if (PRIVATE_ROUTES.includes(pathname)) return true;
  if (PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    return true;
  return false;
}

/**
 * Determine whether a given pathname is an auth page (login / register).
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}
