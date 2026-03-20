import { NextResponse } from "next/server";
import { API_ORIGIN } from "@/lib/origin";

export async function POST(req: Request) {
  // Change origin content, but do NOT revalidate the cached page.
  await fetch(`${API_ORIGIN}/admin/publish`, {
    method: "POST",
    headers: {
      "x-admin-token": "dev",
    },
  }).catch(() => null);

  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}

