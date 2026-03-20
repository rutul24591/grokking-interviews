import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/"],
};

function normalizeRegion(value: string | null): "us" | "eu" {
  const region = (value ?? "us").trim().toLowerCase();
  return region === "eu" ? "eu" : "us";
}

export function middleware(req: NextRequest) {
  const headerRegion = req.headers.get("x-region");
  const queryRegion = req.nextUrl.searchParams.get("region");
  const region = normalizeRegion(headerRegion ?? queryRegion);

  const url = req.nextUrl.clone();
  url.pathname = `/region/${region}`;

  const res = NextResponse.rewrite(url);
  res.headers.set("x-edge-region", region);
  return res;
}

