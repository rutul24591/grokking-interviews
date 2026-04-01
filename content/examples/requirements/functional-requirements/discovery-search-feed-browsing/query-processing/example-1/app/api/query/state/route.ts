import { NextResponse } from "next/server";
import { queryState } from "@/lib/store";
export async function GET() { return NextResponse.json(queryState); }
