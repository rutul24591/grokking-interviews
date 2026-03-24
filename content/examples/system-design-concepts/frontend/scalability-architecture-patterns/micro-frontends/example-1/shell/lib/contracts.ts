import { z } from "zod";

export const MfeToShellSchema = z.discriminatedUnion("type", [
  z.object({
    v: z.literal(1),
    type: z.literal("mfe:ready"),
    payload: z.object({ name: z.string().min(1), contractVersion: z.literal(1) })
  }),
  z.object({
    v: z.literal(1),
    type: z.literal("mfe:height"),
    payload: z.object({ height: z.number().int().min(0).max(5000) })
  }),
  z.object({
    v: z.literal(1),
    type: z.literal("mfe:event"),
    payload: z.object({ name: z.string().min(1), ts: z.string().min(1) })
  })
]);

export type MfeToShell = z.infer<typeof MfeToShellSchema>;

export const ShellToMfeSchema = z.discriminatedUnion("type", [
  z.object({
    v: z.literal(1),
    type: z.literal("shell:setTheme"),
    payload: z.object({ theme: z.enum(["dark", "light"]) })
  })
]);

export type ShellToMfe = z.infer<typeof ShellToMfeSchema>;

