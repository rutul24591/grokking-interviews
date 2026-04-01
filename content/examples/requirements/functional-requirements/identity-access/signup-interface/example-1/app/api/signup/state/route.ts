import { NextResponse } from "next/server";
import { signupState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(signupState);
}
