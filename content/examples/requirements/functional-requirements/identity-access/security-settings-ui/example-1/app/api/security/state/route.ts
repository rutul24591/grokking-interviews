import { NextResponse } from "next/server";
import { securitySettings } from "@/lib/store";

export async function GET() {
  return NextResponse.json(securitySettings);
}
