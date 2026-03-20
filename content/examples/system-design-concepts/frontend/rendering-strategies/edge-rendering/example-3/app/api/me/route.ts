import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export const runtime = "edge";

export async function GET() {
  const secret = process.env.SESSION_SECRET?.trim() || "dev-secret-change-me";
  const value = cookies().get("session")?.value;
  if (!value) return NextResponse.json({ ok: false, error: "missing_session" }, { status: 401 });

  const session = await verifySession(value, secret);
  if (!session) return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 401 });

  return NextResponse.json({ ok: true, session });
}

