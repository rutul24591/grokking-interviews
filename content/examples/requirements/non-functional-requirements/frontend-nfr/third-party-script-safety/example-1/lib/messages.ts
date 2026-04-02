import { z } from "zod";

export const MetricMessageSchema = z.object({
  type: z.literal("metric"),
  name: z.string().min(1).max(40),
  value: z.number().finite()
});

export const CapabilitiesMessageSchema = z.object({
  type: z.literal("capabilities"),
  cookiesVisible: z.boolean(),
  localStorageAccessible: z.boolean()
});

export const ThirdPartyMessageSchema = z.union([MetricMessageSchema, CapabilitiesMessageSchema]);
export type ThirdPartyMessage = z.infer<typeof ThirdPartyMessageSchema>;

