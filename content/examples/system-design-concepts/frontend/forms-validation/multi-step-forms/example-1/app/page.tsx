"use client";

import { useMemo, useState } from "react";
import { stepDefaults, steps } from "@/lib/store";

export default function Page() {
  const [activeStep, setActiveStep] = useState(0);
  const [workspaceName, setWorkspaceName] = useState(stepDefaults.workspaceName);
  const [region, setRegion] = useState(stepDefaults.region);
  const [reviewers, setReviewers] = useState(stepDefaults.reviewers);
  const [complianceAck, setComplianceAck] = useState(stepDefaults.complianceAck);
  const stepStatus = useMemo(() => ({
    workspace: Boolean(workspaceName && region),
    reviewers: reviewers.split(",").map((item) => item.trim()).filter(Boolean).length >= 2,
    confirm: complianceAck
  }), [workspaceName, region, reviewers, complianceAck]);

  function canMoveTo(nextIndex: number) {
    if (nextIndex <= activeStep) return true;
    if (nextIndex === 1) return stepStatus.workspace;
    if (nextIndex === 2) return stepStatus.workspace && stepStatus.reviewers;
    return false;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Multi-step workflow console</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            {steps.map((step, index) => (
              <button key={step.id} onClick={() => canMoveTo(index) && setActiveStep(index)} className="mb-3 w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left">
                <div className="font-medium text-slate-100">{index + 1}. {step.title}</div>
                <div className="mt-1 text-xs text-slate-400">{step.hint}</div>
              </button>
            ))}
          </aside>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            {activeStep === 0 ? (
              <div className="space-y-4">
                <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Workspace name" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
                <input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Region" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
              </div>
            ) : null}
            {activeStep === 1 ? (
              <textarea value={reviewers} onChange={(event) => setReviewers(event.target.value)} placeholder="Comma-separated reviewers" className="min-h-32 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
            ) : null}
            {activeStep === 2 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <p>Workspace: {workspaceName || "missing"}</p>
                  <p>Region: {region || "missing"}</p>
                  <p>Reviewers: {reviewers || "missing"}</p>
                </div>
                <label className="flex items-center gap-3"><input type="checkbox" checked={complianceAck} onChange={(event) => setComplianceAck(event.target.checked)} /> Confirm summary and compliance review</label>
              </div>
            ) : null}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setActiveStep((current) => Math.max(0, current - 1))} className="rounded-2xl border border-slate-700 px-4 py-2">Back</button>
              <button onClick={() => canMoveTo(activeStep + 1) && setActiveStep((current) => Math.min(2, current + 1))} className="rounded-2xl bg-orange-300 px-4 py-2 font-medium text-slate-950">Next</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
