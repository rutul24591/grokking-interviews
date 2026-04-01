import { NextResponse } from "next/server";
import { perfState } from "@/lib/store";
export async function GET() { return NextResponse.json(perfState); }
