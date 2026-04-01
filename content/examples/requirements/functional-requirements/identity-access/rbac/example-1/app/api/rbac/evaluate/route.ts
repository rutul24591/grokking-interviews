import { NextRequest, NextResponse } from "next/server";
import { grantMap, rbacState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role: string; action: string; resource: string };
  const key = `${body.role}:${body.action}` as keyof typeof grantMap;
  const allowed = Boolean(grantMap[key]);
  rbacState.role = body.role;
  rbacState.action = body.action;
  rbacState.resource = body.resource;
  rbacState.lastDecision = allowed ? `Allowed ${body.role} on ${body.resource}.` : `Denied ${body.role} on ${body.resource}.`;
  return NextResponse.json({ ...rbacState, allowed });
}
