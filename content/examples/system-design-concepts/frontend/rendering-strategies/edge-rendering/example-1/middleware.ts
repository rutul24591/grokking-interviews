import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bucketFromUid } from "@/lib/hash";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function randomUid() {
  // Edge-safe random id: Web Crypto is available.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const uidCookie = req.cookies.get("uid")?.value;
  const uid = uidCookie && uidCookie.length > 8 ? uidCookie : randomUid();
  const bucket = bucketFromUid(uid);

  // Stable identity for edge-rendered pages and edge route handlers.
  res.headers.set("x-user-id", uid);
  res.headers.set("x-exp-bucket", bucket);

  if (!uidCookie) {
    res.cookies.set({
      name: "uid",
      value: uid,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}

