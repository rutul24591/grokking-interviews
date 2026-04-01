import { NextResponse } from "next/server";
import { messageState } from "@/lib/store";
export async function GET() { return NextResponse.json(messageState); }
