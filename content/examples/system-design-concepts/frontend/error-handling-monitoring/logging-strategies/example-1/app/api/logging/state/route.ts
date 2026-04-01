import { NextResponse } from "next/server";
import { loggingState } from "@/lib/store";
export async function GET() { return NextResponse.json(loggingState); }
