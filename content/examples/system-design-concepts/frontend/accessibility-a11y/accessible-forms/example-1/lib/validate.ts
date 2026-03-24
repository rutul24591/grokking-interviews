import { z } from "zod";

export type FormInput = {
  fullName: string;
  email: string;
  role: "engineer" | "designer" | "pm";
  updates: boolean;
};

export type FormErrors = Partial<Record<keyof FormInput, string>>;

const Schema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  role: z.enum(["engineer", "designer", "pm"], { message: "Choose a role." }),
  updates: z.boolean()
});

export function validate(input: FormInput): FormErrors {
  const parsed = Schema.safeParse({
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    role: input.role,
    updates: input.updates
  });

  if (parsed.success) return {};
  const out: FormErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as keyof FormInput;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

