import { NextResponse } from "next/server";
import { feedBuilderState } from "@/lib/store";
export async function GET() { return NextResponse.json(feedBuilderState); }
