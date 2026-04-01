import { NextResponse } from "next/server";
import { rotation } from "@/lib/store";

export async function GET() {
  return NextResponse.json(rotation);
}
