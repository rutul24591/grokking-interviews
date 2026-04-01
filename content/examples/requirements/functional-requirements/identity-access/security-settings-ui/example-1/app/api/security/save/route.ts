import { NextRequest, NextResponse } from "next/server";
import { securitySettings } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Omit<typeof securitySettings, "saveCount" | "lastMessage">;
  Object.assign(securitySettings, body);
  securitySettings.saveCount += 1;
  securitySettings.lastMessage = `Security settings saved (revision ${securitySettings.saveCount}).`;
  return NextResponse.json(securitySettings);
}
