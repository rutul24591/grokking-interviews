import { NextResponse } from "next/server"; import { oauth } from "@/lib/store"; export async function GET() { return NextResponse.json(oauth); }
