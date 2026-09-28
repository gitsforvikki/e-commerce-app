import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isPrivateRoute,
  isAuthRoute,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_ROUTE,
} from "@/lib/route-config";

/**
 * Lightweight JWT-payload decoder for Edge Runtime.
 * Only checks structure + expiry — the full cryptographic verification
 * is handled server-side by `lib/auth.ts` (verifyToken) when the page
 * or API route actually loads.  This keeps the proxy fast and
 * Edge-compatible without pulling in Node-only crypto libraries.
 */
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number };

    // Reject if the token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token && isTokenValid(token);

  // ── 1. Auth pages (login / register): redirect authenticated users away ──
  if (isAuthRoute(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
    // Guest on auth page → allow through
    return NextResponse.next();
  }

  // ── 2. Private routes: guests get redirected to login with callback URL ──
  if (isPrivateRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL(LOGIN_ROUTE, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 3. All other routes (public) or authenticated on private → allow ──
  return NextResponse.next();
}

/**
 * Only run this proxy on page routes.
 * Exclude static assets, images, Next.js internals, and API routes
 * (API routes handle their own auth via lib/access-control.ts).
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (favicon)
     * - public assets (svg, png, jpg, etc.)
     * - api routes    (handled server-side)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/).*)",
  ],
};

