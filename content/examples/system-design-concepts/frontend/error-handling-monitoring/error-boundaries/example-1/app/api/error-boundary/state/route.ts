import { NextResponse } from "next/server";
import { boundaryState } from "@/lib/store";
export async function GET() { return NextResponse.json(boundaryState); }
