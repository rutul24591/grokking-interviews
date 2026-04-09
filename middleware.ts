import { NextRequest, NextResponse } from "next/server";

/**
 * Rate-limiting middleware (defensive).
 *
 * Currently the app has no API routes, so this middleware
 * acts as a future-proof guard. If API routes are added,
 * uncomment the rate-limiting logic below.
 */
export function middleware(request: NextRequest) {
  // Defensive: no rate limiting needed for SSG-only routes.
  // When API routes are added, implement token-bucket or sliding-window
  // rate limiting here using Redis, Upstash, or an in-memory store.

  return NextResponse.next();
}

export const config = {
  // Apply to all routes; currently a no-op.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|diagrams|fonts).*)"],
};
