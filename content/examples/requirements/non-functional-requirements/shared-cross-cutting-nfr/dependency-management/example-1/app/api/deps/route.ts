import { NextResponse } from "next/server";
import { listDeps } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ deps: listDeps() });
}

