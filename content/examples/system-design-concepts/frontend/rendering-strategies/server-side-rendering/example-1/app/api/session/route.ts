import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = (url.searchParams.get("uid") ?? "").trim();

  const redirectTo = new URL("/", url);
  const res = NextResponse.redirect(redirectTo, { status: 302 });

  if (uid) {
    res.cookies.set({
      name: "uid",
      value: uid,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    res.cookies.delete("uid");
  }

  return res;
}

