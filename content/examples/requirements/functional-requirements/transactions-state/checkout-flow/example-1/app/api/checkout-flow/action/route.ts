import { NextRequest, NextResponse } from "next/server";
import { mutate } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    type: "next-step" | "create-payment-intent" | "submit-order";
  };
  return NextResponse.json(mutate(body.type));
}
