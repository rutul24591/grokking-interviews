"use client";

import { useMemo, useRef, useState } from "react";
import { ErrorSummary } from "@/components/ErrorSummary";
import { Field } from "@/components/Field";
import { validate, type FormInput, type FormErrors } from "@/lib/validate";

export default function Page() {
  const [data, setData] = useState<FormInput>({
    fullName: "",
    email: "",
    role: "engineer",
    updates: false
  });
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const errors: FormErrors = useMemo(() => (submitted ? validate(data) : {}), [data, submitted]);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Accessible forms: error summary</h1>
        <p className="mt-2 text-slate-300">
          Submit empty to see a focusable error summary that links to invalid fields.
        </p>
      </header>

      <form
        className="rounded-xl border border-white/10 bg-white/5 p-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          const nextErrors = validate(data);
          if (Object.keys(nextErrors).length > 0) {
            window.setTimeout(() => summaryRef.current?.focus(), 0);
          }
        }}
      >
        {hasErrors ? <ErrorSummary ref={summaryRef} errors={errors} /> : null}

        <Field
          id="fullName"
          label="Full name"
          value={data.fullName}
          onChange={(v) => setData((d) => ({ ...d, fullName: v }))}
          help="Use your legal name for account verification."
          error={errors.fullName}
          required
          autoComplete="name"
        />

        <div className="mt-6">
          <Field
            id="email"
            label="Email"
            value={data.email}
            onChange={(v) => setData((d) => ({ ...d, email: v }))}
            help="We’ll use this for sign-in and security alerts."
            error={errors.email}
            required
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <fieldset className="mt-8 rounded-lg border border-white/10 bg-black/30 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-100">Role</legend>
          <p className="mt-2 text-sm text-slate-300" id="role-help">
            Choose the closest role. This changes onboarding content.
          </p>
          {errors.role ? (
            <p className="mt-2 text-sm font-semibold text-rose-300" id="role-error">
              {errors.role}
            </p>
          ) : null}
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {[
              { id: "engineer", label: "Engineer" },
              { id: "designer", label: "Designer" },
              { id: "pm", label: "Product Manager" }
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="role"
                  value={opt.id}
                  checked={data.role === opt.id}
                  aria-describedby={["role-help", errors.role ? "role-error" : null].filter(Boolean).join(" ") || undefined}
                  onChange={() => setData((d) => ({ ...d, role: opt.id as FormInput["role"] }))}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8">
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={data.updates}
              onChange={(e) => setData((d) => ({ ...d, updates: e.target.checked }))}
            />
            Receive product updates
          </label>
        </div>

        <button
          type="submit"
          className="mt-8 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          Create account
        </button>
      </form>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Production notes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Validate on submit by default; validate on blur/typing only when UX requires it.</li>
          <li>Keep error messages deterministic and actionable.</li>
          <li>Never rely on placeholder text as the label.</li>
        </ul>
      </section>
    </main>
  );
}

