import { NextResponse } from "next/server";
import { rankingState } from "@/lib/store";
export async function GET() { return NextResponse.json(rankingState); }
