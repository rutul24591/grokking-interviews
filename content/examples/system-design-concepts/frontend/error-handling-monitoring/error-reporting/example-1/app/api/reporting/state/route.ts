import { NextResponse } from "next/server";
import { reportingState } from "@/lib/store";
export async function GET() { return NextResponse.json(reportingState); }
