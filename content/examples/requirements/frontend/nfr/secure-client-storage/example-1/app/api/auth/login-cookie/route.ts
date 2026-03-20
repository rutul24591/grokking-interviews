import { NextResponse } from "next/server";
import { issueSession } from "@/lib/auth";

export async function POST() {
  const s = issueSession("user_1");
  const res = NextResponse.json({ ok: true, mode: "cookie" as const });
  res.cookies.set("sid", s.sid, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

