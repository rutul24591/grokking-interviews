import { z } from "zod";
import { normalizeText } from "./normalize";

const normalizedString = (min: number, max: number) =>
  z
    .string()
    .transform((s) => normalizeText(s.trim()))
    .refine((s) => s.length >= min && s.length <= max, `Must be between ${min} and ${max} chars`);

export const ticketSchema = z
  .object({
    email: z.string().trim().email().max(254),
    subject: normalizedString(3, 80),
    message: normalizedString(10, 2000),
    priority: z.enum(["low", "medium", "high"]).default("medium")
  })
  .strict();

export type Ticket = z.infer<typeof ticketSchema>;

