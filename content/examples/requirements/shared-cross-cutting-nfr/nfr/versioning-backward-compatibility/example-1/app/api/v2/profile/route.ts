import { NextResponse } from "next/server";
import { z } from "zod";
import { ProfileV2Schema } from "@/lib/contracts";
import { getProfile, setProfile } from "@/lib/store";

export async function GET() {
  const v2 = getProfile();
  // Ensure compatibility field `name` is present.
  const normalized = ProfileV2Schema.parse({ ...v2, name: v2.name ?? v2.displayName });
  return NextResponse.json(normalized);
}

const PatchSchema = z.object({
  displayName: z.string().min(1).max(80),
  locale: z.string().min(2).max(10).optional(),
});

export async function PATCH(req: Request) {
  const body = PatchSchema.parse(await req.json());
  const current = getProfile();
  setProfile({
    ...current,
    displayName: body.displayName,
    name: body.displayName, // keep v1 field aligned
    locale: body.locale ?? current.locale,
  });
  return NextResponse.json({ ok: true });
}

