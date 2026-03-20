import { z } from "zod";

export const ProfileV1Schema = z.object({
  id: z.string(),
  name: z.string(),
});
export type ProfileV1 = z.infer<typeof ProfileV1Schema>;

export const ProfileV2Schema = z.object({
  id: z.string(),
  displayName: z.string(),
  locale: z.string().default("en"),
  // Compatibility: keep v1 field so old clients survive.
  name: z.string().optional(),
});
export type ProfileV2 = z.infer<typeof ProfileV2Schema>;

export function toV1(v2: ProfileV2): ProfileV1 {
  return { id: v2.id, name: v2.name ?? v2.displayName };
}

export function toV2(v1: ProfileV1): ProfileV2 {
  return { id: v1.id, displayName: v1.name, name: v1.name, locale: "en" };
}

