"use client";

import { useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers || {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `${res.status}`);
  return (text ? JSON.parse(text) : null) as T;
}

const starterSchema = [{ name: 'orderId', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }];
const starterPayload = { orderId: 'o-1001', amount: 49 };

export default function Page() {
  const [subject, setSubject] = useState('orders');
  const [version, setVersion] = useState(1);
  const [fieldsText, setFieldsText] = useState(JSON.stringify(starterSchema, null, 2));
  const [payloadText, setPayloadText] = useState(JSON.stringify(starterPayload, null, 2));
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <header className="space-y-2"><h1 className="text-3xl font-bold">Schema Registry Console</h1><p className="text-sm text-slate-300">Register schema versions, then validate payloads against a selected version to catch incompatible producers early.</p></header>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Subject</div><input className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Fields JSON</div><textarea rows={8} className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-xs" value={fieldsText} onChange={(e) => setFieldsText(e.target.value)} /></label>
          <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={async () => { setError(''); try { setResult(await json('/api/schema/register', { method: 'POST', body: JSON.stringify({ subject, fields: JSON.parse(fieldsText) }) })); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Register schema</button>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
          <label className="space-y-1 text-sm"><div className="text-slate-300">Version</div><input type="number" className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2" value={version} onChange={(e) => setVersion(Number(e.target.value))} /></label>
          <label className="space-y-1 text-sm"><div className="text-slate-300">Payload JSON</div><textarea rows={8} className="w-full rounded border border-slate-700 bg-slate-950/40 px-3 py-2 font-mono text-xs" value={payloadText} onChange={(e) => setPayloadText(e.target.value)} /></label>
          <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={async () => { setError(''); try { setResult(await json('/api/schema/validate', { method: 'POST', body: JSON.stringify({ subject, version, payload: JSON.parse(payloadText) }) })); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } }}>Validate payload</button>
          {error ? <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
        </div>
      </section>
      <pre className="overflow-auto rounded-xl border border-slate-700 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether schema governance is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For schema governance, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For schema governance, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For schema governance, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Schema Governance</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}
