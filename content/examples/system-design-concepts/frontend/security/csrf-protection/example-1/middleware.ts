import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

const CSRF_COOKIE = "csrf";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const has = req.cookies.get(CSRF_COOKIE)?.value;
  if (!has) {
    res.cookies.set(CSRF_COOKIE, randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

