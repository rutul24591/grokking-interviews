import { NextResponse } from "next/server";
import { filteringState } from "@/lib/store";
export async function GET() { return NextResponse.json(filteringState); }
