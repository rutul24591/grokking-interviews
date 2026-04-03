"use client";

import { useMemo, useState } from "react";
import { realtimeRules, reservedHandles, validationServices } from "@/lib/store";

export default function Page() {
  const [handle, setHandle] = useState("");
  const [environment, setEnvironment] = useState("prod");
  const [validatorState, setValidatorState] = useState<"idle" | "pending" | "valid" | "invalid" | "throttled">("idle");
  const [requestId, setRequestId] = useState(4);
  const [responseId, setResponseId] = useState(4);
  const [lastValidHandle, setLastValidHandle] = useState("platform-core");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const decision = useMemo(() => {
    if (validatorState === "pending") return "Validation is in flight. Hold final submit.";
    if (validatorState === "throttled") return `Keep the last valid state and retry after ${cooldownSeconds}s.`;
    if (!handle) return "Enter a handle before validation starts.";
    if (reservedHandles.includes(handle)) return "Reserved handles are blocked immediately.";
    return validatorState === "valid" ? `Handle is available for ${environment}.` : "Handle must pass the async validator before submit.";
  }, [cooldownSeconds, environment, handle, validatorState]);

  const canSubmit = validatorState === "valid" && !reservedHandles.includes(handle) && responseId === requestId;
  const responseHistory = [
    `request #${requestId} pending for ${handle || "<empty>"}`,
    `latest applied response #${responseId}`,
    `last known valid handle: ${lastValidHandle}`
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-lime-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Real-time validation lab</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Simulate async handle validation with pending requests, stale responses, throttling, and preserved last-known-good state.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <input
              value={handle}
              onChange={(event) => {
                setHandle(event.target.value);
                setValidatorState("pending");
                setRequestId((current) => current + 1);
              }}
              placeholder="Team handle"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            />
            <select value={environment} onChange={(event) => setEnvironment(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <option value="prod">prod</option>
              <option value="preview">preview</option>
            </select>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setResponseId(requestId);
                  const valid = Boolean(handle) && !reservedHandles.includes(handle);
                  setValidatorState(valid ? "valid" : "invalid");
                  if (valid) setLastValidHandle(handle);
                }}
                className="rounded-2xl bg-lime-300 px-4 py-2 font-medium text-slate-950"
              >
                Apply latest response
              </button>
              <button
                onClick={() => {
                  setValidatorState("throttled");
                  setCooldownSeconds(30);
                }}
                className="rounded-2xl border border-slate-700 px-4 py-2"
              >
                Simulate throttle
              </button>
              <button
                onClick={() => {
                  setResponseId(Math.max(0, requestId - 1));
                  setValidatorState("pending");
                }}
                className="rounded-2xl border border-slate-700 px-4 py-2"
              >
                Simulate stale response
              </button>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Validator state</div>
              <p className="mt-2 text-slate-200">{decision}</p>
              <p className="mt-2">Submit ready: {canSubmit ? "yes" : "no"}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Response timeline</div>
              <ul className="mt-2 space-y-2">{responseHistory.map((entry) => <li key={entry}>{entry}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rules and services</div>
              <ul className="mt-2 space-y-2">{realtimeRules.concat(validationServices).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
