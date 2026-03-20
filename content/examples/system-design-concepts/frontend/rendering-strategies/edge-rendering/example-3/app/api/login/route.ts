import { NextResponse } from "next/server";
import { signSession } from "@/lib/session";

export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = (url.searchParams.get("user") ?? "guest").trim().slice(0, 64);
  const secret = process.env.SESSION_SECRET?.trim() || "dev-secret-change-me";

  const value = await signSession({ sub: user, iat: Date.now() }, secret);

  const res = NextResponse.redirect(new URL("/", url), { status: 302 });
  res.cookies.set({
    name: "session",
    value,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

