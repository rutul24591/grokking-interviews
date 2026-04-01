import { NextResponse } from "next/server";
import { featureState } from "@/lib/store";
export async function GET() { return NextResponse.json(featureState); }
