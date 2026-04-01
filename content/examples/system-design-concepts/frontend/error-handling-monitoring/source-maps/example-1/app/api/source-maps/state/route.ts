import { NextResponse } from "next/server";
import { sourceMapState } from "@/lib/store";
export async function GET() { return NextResponse.json(sourceMapState); }
