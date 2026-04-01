import { NextRequest, NextResponse } from "next/server";
import { oauth } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { provider: string };
  const selected = oauth.providers.find((provider) => provider.name === body.provider);

  if (!selected?.available) {
    oauth.lastMessage = `Provider ${body.provider} is unavailable.`;
    return NextResponse.json(oauth, { status: 400 });
  }

  oauth.started = true;
  oauth.completed = false;
  oauth.provider = selected.name;
  oauth.redirectUri = selected.redirectUri;
  oauth.lastMessage = `Redirected user to ${selected.name} with scopes ${selected.scopes.join(", ")}.`;
  return NextResponse.json(oauth);
}
