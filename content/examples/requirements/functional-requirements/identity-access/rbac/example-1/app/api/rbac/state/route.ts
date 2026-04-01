import { NextResponse } from "next/server";
import { rbacState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(rbacState);
}
