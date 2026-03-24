import { z } from "zod";

const EnvSchema = z.object({
  ASSET_ORIGIN: z.string().url(),
  ASSET_SIGNING_SECRET: z.string().min(8),
});

export function getEnv() {
  return EnvSchema.parse({
    ASSET_ORIGIN: process.env.ASSET_ORIGIN ?? "http://localhost:4020",
    ASSET_SIGNING_SECRET: process.env.ASSET_SIGNING_SECRET ?? "dev-secret-change-me",
  });
}

