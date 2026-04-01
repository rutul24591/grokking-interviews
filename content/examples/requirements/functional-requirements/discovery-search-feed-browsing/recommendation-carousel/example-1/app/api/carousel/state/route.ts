import { NextResponse } from "next/server";
import { carouselState } from "@/lib/store";
export async function GET() {
  return NextResponse.json(carouselState);
}
