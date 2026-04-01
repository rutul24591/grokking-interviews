import { NextResponse } from "next/server";
import { cdnDeliveryState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(cdnDeliveryState);
}
