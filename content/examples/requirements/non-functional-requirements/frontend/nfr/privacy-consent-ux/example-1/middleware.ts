import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookieName, decodeConsent } from "@/lib/consent";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const consent = decodeConsent(req.cookies.get(cookieName())?.value);
  const res = NextResponse.next();
  // Pass consent to API routes in a header (so server code doesn’t need cookie parsing everywhere).
  res.headers.set("x-consent-analytics", consent?.analytics ? "1" : "0");
  res.headers.set("x-consent-marketing", consent?.marketing ? "1" : "0");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

