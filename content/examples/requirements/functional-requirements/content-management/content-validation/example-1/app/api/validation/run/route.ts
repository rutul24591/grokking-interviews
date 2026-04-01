import { NextRequest, NextResponse } from "next/server";
import { validationState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string; result: "pass" | "warning" | "fail" };
  validationState.checks = validationState.checks.map((check) =>
    check.id === body.id ? { ...check, result: body.result } : check
  );
  validationState.lastMessage = `Re-ran validation check ${body.id} and updated the publish gate state.`;
  return NextResponse.json(validationState);
}
