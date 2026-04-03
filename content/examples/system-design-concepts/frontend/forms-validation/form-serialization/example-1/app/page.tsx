"use client";

import { useMemo, useState } from "react";
import { destinationSchemas, serializationDefaults, serializationNotes } from "@/lib/store";

export default function Page() {
  const [name, setName] = useState(serializationDefaults.customer.name);
  const [email, setEmail] = useState(serializationDefaults.customer.email);
  const [tier, setTier] = useState(serializationDefaults.customer.tier);
  const [mode, setMode] = useState(serializationDefaults.shipping.mode);
  const [instructions, setInstructions] = useState(serializationDefaults.shipping.instructions);
  const [requiresSignature, setRequiresSignature] = useState(serializationDefaults.shipping.requiresSignature);
  const [emailNotify, setEmailNotify] = useState(serializationDefaults.notifications.email);
  const [smsNotify, setSmsNotify] = useState(serializationDefaults.notifications.sms);
  const [webhookNotify, setWebhookNotify] = useState(serializationDefaults.notifications.webhook);
  const [giftWrap, setGiftWrap] = useState(serializationDefaults.giftWrap.enabled);
  const [giftNote, setGiftNote] = useState(serializationDefaults.giftWrap.note);
  const [target, setTarget] = useState<"checkout" | "audit" | "queue">("checkout");

  const payload = useMemo(() => {
    const out: Record<string, unknown> = {
      customer: { name, email, tier },
      shipping: { mode, requiresSignature },
      notifications: { email: emailNotify, sms: smsNotify, webhook: webhookNotify },
      tags: serializationDefaults.tags,
      target
    };
    if (instructions.trim()) out.shipping = { ...(out.shipping as object), instructions };
    if (giftWrap) out.giftWrap = { enabled: true, note: giftNote.trim() || "Standard celebration packaging" };
    if (target === "audit") out.auditSummary = { reviewer: "support-ops", reason: "manual-serialization-check" };
    if (target === "queue") out.queue = { priority: tier === "enterprise" ? "high" : "normal" };
    return out;
  }, [name, email, tier, mode, requiresSignature, instructions, emailNotify, smsNotify, webhookNotify, giftWrap, giftNote, target]);

  const warnings = useMemo(() => {
    const out: string[] = [];
    if (!giftWrap && giftNote.trim()) out.push("Gift note should be stripped because gift wrap is disabled.");
    if (target === "checkout" && webhookNotify) out.push("Webhook notifications belong to async queue payloads, not direct checkout submit.");
    if (!instructions.trim() && requiresSignature) out.push("Signature-required shipments should include operator instructions.");
    return out;
  }, [giftWrap, giftNote, target, webhookNotify, instructions, requiresSignature]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Forms validation</p>
        <h1 className="mt-2 text-3xl font-semibold">Serialization preview console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Build nested form state, switch target payloads, and review hidden-field stripping before submission.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="grid gap-4 md:grid-cols-2">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Customer name" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Customer email" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select value={tier} onChange={(event) => setTier(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="enterprise">Enterprise</option>
                <option value="team">Team</option>
              </select>
              <select value={mode} onChange={(event) => setMode(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="standard">Standard</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Optional shipping instructions" className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3"><input type="checkbox" checked={emailNotify} onChange={(event) => setEmailNotify(event.target.checked)} /> Email updates</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={smsNotify} onChange={(event) => setSmsNotify(event.target.checked)} /> SMS updates</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={webhookNotify} onChange={(event) => setWebhookNotify(event.target.checked)} /> Webhook callback</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={requiresSignature} onChange={(event) => setRequiresSignature(event.target.checked)} /> Signature required</label>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_200px]">
              <label className="flex items-center gap-3"><input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} /> Gift wrap</label>
              <select value={target} onChange={(event) => setTarget(event.target.value as typeof target)} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <option value="checkout">Checkout payload</option>
                <option value="audit">Audit payload</option>
                <option value="queue">Queue payload</option>
              </select>
            </div>
            <textarea value={giftNote} onChange={(event) => setGiftNote(event.target.value)} placeholder="Gift note" className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Payload preview</div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">{JSON.stringify(payload, null, 2)}</pre>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Warnings</div>
              {warnings.length === 0 ? <p className="mt-2 text-emerald-200">No serialization hazards detected.</p> : <ul className="mt-2 space-y-2 text-amber-200">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Schemas and notes</div>
              <ul className="mt-2 space-y-2">{destinationSchemas.concat(serializationNotes).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
