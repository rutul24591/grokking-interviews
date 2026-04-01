import { NextRequest, NextResponse } from "next/server";
import { evaluatePolicy } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role: Parameters<typeof evaluatePolicy>[0]; resource: Parameters<typeof evaluatePolicy>[1]; action: Parameters<typeof evaluatePolicy>[2] };
  return NextResponse.json(evaluatePolicy(body.role, body.resource, body.action));
}
