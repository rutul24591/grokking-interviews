import { z } from "zod";

export const featureFlagsResponseSchema = z.object({
  flags: z.array(
    z.object({
      key: z.string().min(1),
      enabled: z.boolean(),
      variant: z.string().optional()
    })
  )
});

export type FeatureFlagsResponse = z.infer<typeof featureFlagsResponseSchema>;

