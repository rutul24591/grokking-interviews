import { NextResponse } from "next/server";
import { z } from "zod";
import { ProfileV1Schema, toV1, toV2 } from "@/lib/contracts";
import { getProfile, setProfile } from "@/lib/store";

export async function GET() {
  const v2 = getProfile();
  const v1 = toV1(v2);
  return NextResponse.json(v1, {
    headers: {
      Deprecation: "true",
      Sunset: "Fri, 01 May 2026 00:00:00 GMT",
    },
  });
}

const PatchSchema = ProfileV1Schema.pick({ name: true });

export async function PATCH(req: Request) {
  const body = PatchSchema.parse(await req.json());
  const current = getProfile();
  // v1 updates map to displayName and keep name for compat.
  setProfile({ ...current, displayName: body.name, name: body.name });
  return NextResponse.json({ ok: true });
}

