import React, { useCallback } from "react";
import type { ValidationPlan } from "../lib/types";
import { useForm } from "../hooks/use-form";

type Values = {
  email: string;
  username: string;
};

const plan: ValidationPlan<Values> = {
  fields: [
    {
      field: "email",
      validators: [
        {
          kind: "sync",
          id: "email-format",
          run: (v) => {
            const email = String(v.email ?? "");
            if (!email.includes("@")) {
              return [{ field: "email", code: "invalid_email", message: "Email is invalid." }];
            }
            return null;
          },
        },
      ],
    },
    {
      field: "username",
      validators: [
        {
          kind: "sync",
          id: "username-len",
          run: (v) => {
            const u = String(v.username ?? "");
            if (u.length < 3) {
              return [
                { field: "username", code: "too_short", message: "Username must be 3+ chars." },
              ];
            }
            return null;
          },
        },
        {
          kind: "async",
          id: "username-unique",
          run: async (v) => {
            const u = String(v.username ?? "");
            // Simulated API call: disallow "admin"
            await new Promise((r) => setTimeout(r, 250));
            if (u.toLowerCase() === "admin") {
              return [
                {
                  field: "username",
                  code: "taken",
                  message: "Username is unavailable.",
                },
              ];
            }
            return null;
          },
        },
      ],
    },
  ],
};

export function ExampleForm() {
  const form = useForm<Values>({
    initialValues: { email: "", username: "" },
    plan,
  });

  const onBlurUsername = useCallback(() => {
    form.touch("username");
    void form.validateAsync({ field: "username" });
  }, [form]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const sync = form.validateSync();
        if (!sync.isValid) return;
        void form.validateAsync().then((res) => {
          if (res.isValid) {
            // Submit
          }
        });
      }}
      aria-label="Example form"
    >
      <label>
        Email
        <input
          value={form.values.email}
          onChange={(e) => form.setValue("email", e.target.value)}
          onBlur={() => form.touch("email")}
          aria-invalid={!!form.errors.fieldErrors.email?.length}
        />
      </label>
      <div role="alert">
        {form.touched.email ? form.errors.fieldErrors.email?.[0]?.message : null}
      </div>

      <label>
        Username
        <input
          value={form.values.username}
          onChange={(e) => form.setValue("username", e.target.value)}
          onBlur={onBlurUsername}
          aria-invalid={!!form.errors.fieldErrors.username?.length}
        />
      </label>
      <div role="alert">
        {form.validating.username ? "Checking availability…" : null}
        {form.touched.username ? form.errors.fieldErrors.username?.[0]?.message : null}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

