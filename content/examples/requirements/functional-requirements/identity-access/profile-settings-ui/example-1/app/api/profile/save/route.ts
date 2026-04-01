import { NextRequest, NextResponse } from "next/server";
import { profileState } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name: string;
    title: string;
    timezone: string;
    visibility: "public" | "team" | "private";
  };
  profileState.name = body.name;
  profileState.title = body.title;
  profileState.timezone = body.timezone;
  profileState.visibility = body.visibility;
  profileState.saveVersion += 1;
  profileState.lastMessage = `Saved profile version ${profileState.saveVersion}.`;
  return NextResponse.json(profileState);
}
