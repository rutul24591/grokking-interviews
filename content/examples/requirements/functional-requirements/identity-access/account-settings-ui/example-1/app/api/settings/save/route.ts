import { NextRequest, NextResponse } from "next/server";
import { settings } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Omit<typeof settings, "lastSavedAt">;
  settings.displayName = body.displayName;
  settings.timezone = body.timezone;
  settings.marketingEmails = body.marketingEmails;
  settings.sessionAlerts = body.sessionAlerts;
  settings.lastSavedAt = new Date().toISOString();
  return NextResponse.json(settings);
}
