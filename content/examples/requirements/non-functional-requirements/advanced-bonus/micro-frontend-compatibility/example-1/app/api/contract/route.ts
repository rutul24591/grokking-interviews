import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hostContractVersion: 2,
    supportedRemoteMajorVersions: [1, 2],
    remoteKind: "custom-element",
  });
}

