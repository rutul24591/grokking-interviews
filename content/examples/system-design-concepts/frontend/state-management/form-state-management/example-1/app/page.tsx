"use client";

import { useMemo, useState } from "react";

type Values = { teamName: string; adminEmail: string; region: string; seats: string };
const initialValues: Values = { teamName: "", adminEmail: "", region: "us-east", seats: "10" };

function validate(values: Values) {
  return {
    teamName: values.teamName.trim().length < 3 ? "Team name must be at least 3 characters" : "",
    adminEmail: values.adminEmail.includes("@") ? "" : "Use a valid admin email",
    region: values.region ? "" : "Select a region",
    seats: Number(values.seats) > 0 ? "" : "Seats must be positive"
  };
}

export default function Page() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>({ teamName: false, adminEmail: false, region: false, seats: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const errors = useMemo(() => validate(values), [values]);
  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues);
  const canSubmit = Object.values(errors).every((value) => !value) && dirty && !isSubmitting;

  async function submit() {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(`Provisioned ${values.teamName} in ${values.region} for ${values.seats} seats.`);
    setIsSubmitting(false);
  }

  const fields: { key: keyof Values; label: string; type?: string }[] = [
    { key: "teamName", label: "Team name" },
    { key: "adminEmail", label: "Admin email", type: "email" },
    { key: "region", label: "Region" },
    { key: "seats", label: "Seats", type: "number" }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Form state management</p>
        <h1 className="mt-2 text-3xl font-semibold">Team onboarding wizard</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (canSubmit) void submit(); }}>
            {fields.map((field) => (
              <label key={field.key} className="block text-sm text-slate-300">
                {field.label}
                <input
                  type={field.type ?? "text"}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3"
                  value={values[field.key]}
                  onBlur={() => setTouched((current) => ({ ...current, [field.key]: true }))}
                  onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))}
                />
                {touched[field.key] && errors[field.key] ? <span className="mt-2 block text-xs text-rose-300">{errors[field.key]}</span> : null}
              </label>
            ))}
            <button disabled={!canSubmit} className="rounded-2xl bg-fuchsia-400 px-4 py-3 font-medium text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300">{isSubmitting ? "Provisioning…" : "Create workspace"}</button>
          </form>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <h2 className="text-lg font-medium">State snapshot</h2>
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300">{JSON.stringify({ values, touched, errors, dirty, canSubmit }, null, 2)}</pre>
            {submitted ? <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-emerald-100">{submitted}</p> : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
