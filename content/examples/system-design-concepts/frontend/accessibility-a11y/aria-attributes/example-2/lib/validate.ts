import { z } from "zod";

const EmailSchema = z.string().email();

export function validateEmail(email: string): string | null {
  const parsed = EmailSchema.safeParse(email.trim());
  if (!parsed.success) return "Enter a valid email address.";
  return null;
}

