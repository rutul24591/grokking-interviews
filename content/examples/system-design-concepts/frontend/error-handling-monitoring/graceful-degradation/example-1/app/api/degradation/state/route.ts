import { NextResponse } from "next/server";
import { degradationState } from "@/lib/store";
export async function GET() { return NextResponse.json(degradationState); }
