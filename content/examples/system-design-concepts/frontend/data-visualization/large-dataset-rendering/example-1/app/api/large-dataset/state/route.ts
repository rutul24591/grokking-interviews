import { NextResponse } from "next/server";
import { datasetState } from "@/lib/store";

export async function GET() {
  return NextResponse.json(datasetState);
}
