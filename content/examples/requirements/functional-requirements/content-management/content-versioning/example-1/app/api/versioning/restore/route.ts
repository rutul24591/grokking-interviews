import { NextRequest, NextResponse } from "next/server";
import { versioningState } from "@/lib/store";
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { id: string };
  versioningState.currentVersionId = body.id;
  versioningState.versions = versioningState.versions.map((version) => ({ ...version, active: version.id === body.id }));
  versioningState.lastMessage = `Restored ${body.id} as the active revision while preserving the newer revisions for audit history.`;
  return NextResponse.json(versioningState);
}
