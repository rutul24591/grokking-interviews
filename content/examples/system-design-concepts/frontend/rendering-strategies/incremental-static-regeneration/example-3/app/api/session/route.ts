import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = (url.searchParams.get("uid") ?? "guest").trim();
  const res = NextResponse.redirect(new URL("/personalized", url), { status: 302 });
  res.cookies.set({
    name: "uid",
    value: uid,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

