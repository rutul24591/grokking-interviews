import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function stripTrackingParams(url: URL) {
  const toDelete: string[] = [];
  for (const [k] of url.searchParams.entries()) {
    if (k.toLowerCase().startsWith("utm_")) toDelete.push(k);
  }
  toDelete.forEach((k) => url.searchParams.delete(k));
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const before = url.toString();
  stripTrackingParams(url);

  if (url.toString() !== before) {
    // 301 for canonicalization. (In real deployments, be careful during migrations.)
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products"]
};

