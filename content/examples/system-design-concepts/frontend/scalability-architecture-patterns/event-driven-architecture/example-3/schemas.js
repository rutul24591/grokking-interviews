import { z } from "zod";

export const envelopeBase = z.object({
  id: z.string().min(1),
  ts: z.number().int(),
  type: z.string().min(1),
  v: z.number().int()
});

export const userCreatedV1 = envelopeBase.extend({
  type: z.literal("user.created"),
  v: z.literal(1),
  data: z.object({
    userId: z.string(),
    email: z.string().email()
  })
});

export const userCreatedV2 = envelopeBase.extend({
  type: z.literal("user.created"),
  v: z.literal(2),
  data: z.object({
    userId: z.string(),
    email: z.string().email(),
    // v2 adds a displayName. Optional in the wire schema for safe rollout.
    displayName: z.string().min(1).optional()
  })
});

export function normalizeUserCreated(evt) {
  if (evt.v === 1) {
    return {
      id: evt.id,
      ts: evt.ts,
      type: evt.type,
      v: 2,
      data: { ...evt.data, displayName: evt.data.email.split("@")[0] }
    };
  }
  return {
    id: evt.id,
    ts: evt.ts,
    type: evt.type,
    v: 2,
    data: { ...evt.data, displayName: evt.data.displayName ?? evt.data.email.split("@")[0] }
  };
}

