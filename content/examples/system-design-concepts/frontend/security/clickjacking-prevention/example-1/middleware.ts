import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/protected")) {
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  }
  return res;
}

export const config = {
  matcher: ["/protected/:path*"]
};

