import { NextResponse } from "next/server";
import { registrationState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(registrationState);
}
