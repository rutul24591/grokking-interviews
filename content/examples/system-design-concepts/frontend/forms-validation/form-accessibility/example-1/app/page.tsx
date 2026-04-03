"use client";

import { useMemo, useState } from "react";
import { accessibilityChecklist, accessibilityScenarios, accessibleFields } from "@/lib/store";

type FormValues = {
  ticketTitle: string;
  severity: string;
  details: string;
  contact: string;
};

const initialValues: FormValues = {
  ticketTitle: "",
  severity: "",
  details: "",
  contact: ""
};

export default function Page() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState<"Basics" | "Context">("Basics");
  const [lastAnnouncement, setLastAnnouncement] = useState("No announcements yet.");

  const errors = useMemo(
    () => ({
      ticketTitle: values.ticketTitle ? "" : "Provide a short ticket title.",
      severity: values.severity ? "" : "Select the customer impact level.",
      details: values.details.length >= 20 ? "" : "Details should be at least 20 characters.",
      contact: values.contact.includes("@") ? "" : "Provide a reachable responder email."
    }),
    [values]
  );

  const firstErrorEntry = Object.entries(errors).find(([, value]) => value);
  const firstErrorField = firstErrorEntry?.[0] as keyof FormValues | undefined;
  const errorSummary = Object.entries(errors).filter(([, value]) => value);
  const canSubmit = errorSummary.length === 0;

  function runSubmit() {
    setSubmitted(true);
    if (canSubmit) {
      setLastAnnouncement("Form can be submitted accessibly. Live region announces success.");
      return;
    }

    const blockingField = accessibleFields.find((field) => field.id === firstErrorField);
    if (blockingField && blockingField.step !== activeStep) {
      setActiveStep(blockingField.step as "Basics" | "Context");
      setLastAnnouncement(`Reveal ${blockingField.step} and move focus to ${blockingField.label}.`);
      return;
    }

    setLastAnnouncement(`Move focus to ${blockingField?.label ?? "the first invalid field"} and announce the linked error summary.`);
  }

  const visibleFields = accessibleFields.filter((field) => field.step === activeStep);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Accessible support request review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Validate a multi-step form for label coverage, error announcements, hidden-step recovery, and keyboard-safe submit behavior.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5" onSubmit={(event) => { event.preventDefault(); runSubmit(); }}>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => setActiveStep("Basics")} className={`rounded-2xl px-4 py-2 ${activeStep === "Basics" ? "bg-emerald-300 text-slate-950" : "border border-slate-700"}`}>
                Basics
              </button>
              <button type="button" onClick={() => setActiveStep("Context")} className={`rounded-2xl px-4 py-2 ${activeStep === "Context" ? "bg-emerald-300 text-slate-950" : "border border-slate-700"}`}>
                Context
              </button>
            </div>
            <div aria-live="polite" className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              {lastAnnouncement}
            </div>
            {submitted && errorSummary.length > 0 ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
                <div className="font-medium">Error summary</div>
                <ul className="mt-2 space-y-2">
                  {errorSummary.map(([field, message]) => <li key={field}>{message}</li>)}
                </ul>
              </div>
            ) : null}
            {visibleFields.map((field) => (
              <label key={field.id} className="block text-sm text-slate-200">
                <span className="font-medium">{field.label}</span>
                <span id={`${field.id}-description`} className="mt-1 block text-xs text-slate-400">{field.description}</span>
                {field.id === "details" ? (
                  <textarea
                    aria-describedby={`${field.id}-description ${field.id}-error`}
                    value={values.details}
                    onChange={(event) => setValues((current) => ({ ...current, details: event.target.value }))}
                    className="mt-2 min-h-32 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />
                ) : (
                  <input
                    aria-describedby={`${field.id}-description ${field.id}-error`}
                    value={values[field.id as keyof FormValues]}
                    onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
                  />
                )}
                <span id={`${field.id}-error`} className="mt-2 block min-h-5 text-xs text-rose-300">{submitted ? errors[field.id as keyof FormValues] : ""}</span>
              </label>
            ))}
            <button className="rounded-2xl bg-emerald-300 px-4 py-3 font-medium text-slate-950">Run accessibility submit</button>
          </form>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Checklist</div>
              <ul className="mt-3 space-y-2">
                {accessibilityChecklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Scenarios</div>
              <ul className="mt-3 space-y-2">
                {accessibilityScenarios.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
