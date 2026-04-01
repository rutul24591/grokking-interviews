import { NextResponse } from "next/server"; import { reset } from "@/lib/store"; export async function GET() { return NextResponse.json(reset); }
