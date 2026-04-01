import { NextRequest, NextResponse } from "next/server";
import { attemptLogin } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password: string };
  return NextResponse.json(attemptLogin(body.password));
}
