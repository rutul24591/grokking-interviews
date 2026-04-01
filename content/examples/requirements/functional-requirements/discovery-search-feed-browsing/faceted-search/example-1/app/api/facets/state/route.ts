import { NextResponse } from "next/server";
import { facetState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(facetState);
}
