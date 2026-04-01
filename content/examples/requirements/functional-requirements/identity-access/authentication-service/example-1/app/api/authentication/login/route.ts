import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email: string; password: string };
  const next = login(body.email, body.password);
  return NextResponse.json(next, { status: next.user ? 200 : 401 });
}
