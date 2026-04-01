import { NextRequest, NextResponse } from "next/server";
import { sessions } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string };
  const target = sessions.find((session) => session.id === body.id);
  if (target && !target.current) target.active = false;
  return NextResponse.json(sessions);
}
