"use client";

import { useMemo, useState } from "react";
import { notificationPolicies, notificationRecovery, notificationSessions } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [elevatedInbox, setElevatedInbox] = useState(false);
  const [digestMode, setDigestMode] = useState(false);
  const session = notificationSessions[selected];

  const deliveryPlan = useMemo(() => {
    if (session.deliveryState === "repair") return "Channel health is degraded. Route urgent notifications into the elevated in-app tray and show channel repair status.";
    if (session.muted) return "Muted state wins. Suppress push, keep only low-noise inbox recording, and never escalate routine activity.";
    if (!pushEnabled) return "Push is disabled. Keep the inbox current and surface urgent items in the in-app alert rail.";
    return session.urgentCount > 0 ? "Push urgent items and mirror them in-app with dedupe guards." : "In-app delivery is enough for routine activity.";
  }, [pushEnabled, session]);

  const inboxAdvice = useMemo(() => {
    if (elevatedInbox) return "Elevated inbox mode pins urgent cards above routine updates and preserves dismissal state.";
    return `Unread count ${session.unreadCount}; dedupe window ${session.dedupeWindowMinutes} minute(s).`;
  }, [elevatedInbox, session]);

  const channelReview = useMemo(() => {
    if (session.muted) return "Mute policy overrides all real-time urgency except explicit safety or incident exceptions.";
    if (digestMode && session.urgentCount === 0) return "Digest mode is acceptable for routine traffic. Collapse bursty activity into grouped summaries.";
    if (session.deliveryState !== "healthy") return "Channel health is degraded. Prefer in-app continuity, then re-enable push only after recovery.";
    return "Channel mix is healthy. Use push for urgent items and keep inbox continuity for everything else.";
  }, [digestMode, session]);

  const queueBreakdown = useMemo(() => [
    { label: "Urgent lane", value: session.urgentCount, note: session.deliveryState === "healthy" ? "eligible for push + inbox" : "route to elevated inbox" },
    { label: "Routine lane", value: Math.max(session.unreadCount - session.urgentCount, 0), note: digestMode ? "group into digest cards" : "stream into standard inbox" },
    { label: "Muted lane", value: session.muted ? session.unreadCount : 0, note: session.muted ? "record silently without push" : "not active" }
  ], [digestMode, session]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Real-time features</p>
        <h1 className="mt-2 text-3xl font-semibold">Real-time notifications console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review push versus in-app delivery, deduplication, mute enforcement, and urgent notification routing.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {notificationSessions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={pushEnabled} onChange={(event) => setPushEnabled(event.target.checked)} /> Push enabled</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={elevatedInbox} onChange={(event) => setElevatedInbox(event.target.checked)} /> Elevated urgent inbox</label>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={digestMode} onChange={(event) => setDigestMode(event.target.checked)} /> Digest routine notifications</label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Notification mix</div>
                <p className="mt-2">Channels: {session.channelMix.join(", ")}</p>
                <p className="mt-2">Unread: {session.unreadCount}</p>
                <p className="mt-2">Urgent: {session.urgentCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Delivery state</div>
                <p className="mt-2">Health: {session.deliveryState}</p>
                <p className="mt-2">Muted: {session.muted ? "yes" : "no"}</p>
                <p className="mt-2">Dedupe window: {session.dedupeWindowMinutes}m</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Delivery plan</div><p className="mt-2">{deliveryPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Notification lanes</div>
              <ul className="mt-2 space-y-2">
                {queueBreakdown.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Inbox advice</div><p className="mt-2">{inboxAdvice}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Channel review</div><p className="mt-2">{channelReview}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{notificationPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{notificationRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
