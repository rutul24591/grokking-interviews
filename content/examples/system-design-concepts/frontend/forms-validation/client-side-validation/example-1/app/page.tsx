"use client";

import { useMemo, useState } from "react";
import { validationFields, validationPolicies } from "@/lib/store";

type Values = Record<(typeof validationFields)[number]["id"], string>;
const initialValues: Values = { displayName: "", email: "", password: "", confirmPassword: "", region: "" };

function validate(values: Values) {
  return {
    displayName: values.displayName.trim().length >= 4 ? "" : "Display name must be at least 4 characters.",
    email: values.email.endsWith("@company.com") ? "" : "Use a company domain email.",
    password: values.password.length >= 10 && /\d/.test(values.password) ? "" : "Password must be 10+ characters with one number.",
    confirmPassword: values.confirmPassword === values.password && values.confirmPassword ? "" : "Confirmation must match the password.",
    region: values.region ? "" : "Select the deployment region."
  };
}

export default function Page() {
  const [values, setValues] = useState<Values>(initialValues);
  const [touched, setTouched] = useState<Record<keyof Values, boolean>>({ displayName: false, email: false, password: false, confirmPassword: false, region: false });
  const [submitMessage, setSubmitMessage] = useState("Validation summary not reviewed yet.");
  const errors = useMemo(() => validate(values), [values]);
  const visibleErrors = Object.entries(errors).filter(([, value]) => value);
  const canSubmit = visibleErrors.length === 0 && Object.values(values).every(Boolean);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Client-side validation studio</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSubmitMessage(canSubmit ? `Accepted ${values.displayName} for ${values.region}.` : "Submission blocked until all client rules pass."); }}>
            {validationFields.map((field) => (
              <label key={field.id} className="block text-sm text-slate-200">
                <span className="font-medium">{field.label}</span>
                <input
                  type={field.type}
                  value={values[field.id]}
                  placeholder={field.placeholder}
                  onBlur={() => setTouched((current) => ({ ...current, [field.id]: true }))}
                  onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                />
                {touched[field.id] && errors[field.id] ? <span className="mt-2 block text-xs text-rose-300">{errors[field.id]}</span> : null}
              </label>
            ))}
            <button className="rounded-2xl bg-violet-400 px-4 py-3 font-medium text-slate-950" type="submit">Review submit readiness</button>
          </form>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Validation policies</div>
              <ul className="mt-3 space-y-2">
                {validationPolicies.map((policy) => <li key={policy}>{policy}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Error summary</div>
              {visibleErrors.length === 0 ? <p className="mt-2 text-emerald-200">All client rules pass.</p> : (
                <ul className="mt-2 space-y-2 text-rose-200">
                  {visibleErrors.map(([key, value]) => <li key={key}>{value}</li>)}
                </ul>
              )}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Decision</div>
              <p className="mt-2">{submitMessage}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
