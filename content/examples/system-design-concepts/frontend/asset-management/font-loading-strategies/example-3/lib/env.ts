import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_FONT_CDN_ORIGIN: z.string().url(),
});

export function getPublicEnv() {
  return EnvSchema.parse({
    NEXT_PUBLIC_FONT_CDN_ORIGIN: process.env.NEXT_PUBLIC_FONT_CDN_ORIGIN ?? "http://localhost:4010",
  });
}

