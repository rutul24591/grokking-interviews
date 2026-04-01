import { NextResponse } from "next/server";
import { emailVerification } from "@/lib/store";

export async function GET() {
  return NextResponse.json(emailVerification);
}
