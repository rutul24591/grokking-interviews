import { NextResponse } from "next/server";
import { globalHandlerState } from "@/lib/store";
export async function GET() { return NextResponse.json(globalHandlerState); }
