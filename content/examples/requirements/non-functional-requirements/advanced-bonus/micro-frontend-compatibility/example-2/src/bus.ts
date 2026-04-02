import { z } from "zod";

const V1Navigate = z.object({ type: z.literal("navigate"), to: z.string() });
const V2Navigate = z.object({ type: z.literal("navigate"), to: z.string(), replace: z.boolean().default(false) });

export type EventV1 = z.infer<typeof V1Navigate>;
export type EventV2 = z.infer<typeof V2Navigate>;

export function parseEvent(version: 1 | 2, raw: unknown): EventV2 {
  if (version === 2) return V2Navigate.parse(raw);
  const v1 = V1Navigate.parse(raw);
  // shim v1 -> v2
  return { ...v1, replace: false };
}

