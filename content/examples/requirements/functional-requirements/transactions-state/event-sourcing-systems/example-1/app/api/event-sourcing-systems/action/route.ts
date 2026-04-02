import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { type: "append-event"; value?: "order-created" | "payment-authorized" | "payment-captured" | "refund-issued" };
  return NextResponse.json(mutate(body.type, body.value));
}
