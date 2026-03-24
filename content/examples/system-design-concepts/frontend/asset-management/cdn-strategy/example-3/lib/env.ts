import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_PRIMARY_CDN: z.string().url(),
  NEXT_PUBLIC_SECONDARY_CDN: z.string().url(),
});

export function getPublicEnv() {
  return EnvSchema.parse({
    NEXT_PUBLIC_PRIMARY_CDN: process.env.NEXT_PUBLIC_PRIMARY_CDN ?? "http://localhost:4001",
    NEXT_PUBLIC_SECONDARY_CDN: process.env.NEXT_PUBLIC_SECONDARY_CDN ?? "http://localhost:4002",
  });
}

