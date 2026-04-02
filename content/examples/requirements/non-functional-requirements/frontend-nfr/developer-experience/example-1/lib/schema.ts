import { z } from "zod";

export const AppConfigSchema = z.object({
  env: z.enum(["dev", "staging", "prod"]),
  publicBaseUrl: z.string().url(),
  apiKey: z.string().min(10),
  rumSampleRate: z.number().min(0).max(1).default(0.1),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function formatZodErrors(err: z.ZodError) {
  return err.issues.map((i) => ({
    path: i.path.join(".") || "(root)",
    message: i.message,
    code: i.code,
  }));
}

