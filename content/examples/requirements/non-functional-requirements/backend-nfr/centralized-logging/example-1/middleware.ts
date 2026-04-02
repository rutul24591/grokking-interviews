import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const requestHeaders = new Headers(req.headers);
  if (!requestHeaders.get("x-request-id")) requestHeaders.set("x-request-id", crypto.randomUUID());
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

