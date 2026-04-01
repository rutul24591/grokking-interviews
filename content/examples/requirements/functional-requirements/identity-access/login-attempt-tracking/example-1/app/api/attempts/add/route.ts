import { NextRequest, NextResponse } from "next/server";
import { attempts } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { result: 'success' | 'failure'; sourceIp: string };
  attempts.unshift({ id: `try-${attempts.length + 1}`, result: body.result, sourceIp: body.sourceIp, at: new Date().toISOString() });
  return NextResponse.json(attempts);
}
