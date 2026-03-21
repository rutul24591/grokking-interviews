import { z } from "zod";

export const V1 = z.object({ id: z.string(), name: z.string() });
export const V2 = z.object({ id: z.string(), displayName: z.string(), name: z.string().optional(), locale: z.string().default("en") });

export function v2FromV1(v1: z.infer<typeof V1>): z.infer<typeof V2> {
  return { id: v1.id, displayName: v1.name, name: v1.name, locale: "en" };
}

export function v1FromV2(v2: z.infer<typeof V2>): z.infer<typeof V1> {
  return { id: v2.id, name: v2.name ?? v2.displayName };
}

