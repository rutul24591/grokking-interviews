"use client";

import { useMemo, useState } from "react";
import { rtlChecks, rtlLocales } from "@/lib/store";

export default function Page() {
  const [locale, setLocale] = useState("ar");
  const [mirrorIcons, setMirrorIcons] = useState(true);
  const isRtl = rtlLocales.includes(locale);
  const guidance = useMemo(() => {
    if (!isRtl) return "Keep the standard LTR layout and avoid forced mirroring.";
    return mirrorIcons ? "Mirror directional controls and keep order IDs isolated in LTR spans." : "Layout is RTL but directional icons are still wrong.";
  }, [isRtl, mirrorIcons]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-rose-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">RTL support console</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300 ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
            <select value={locale} onChange={(event) => setLocale(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              <option value="ar">ar</option>
              <option value="he">he</option>
              <option value="en">en</option>
            </select>
            <label className="mt-4 flex items-center gap-3"><input type="checkbox" checked={mirrorIcons} onChange={(event) => setMirrorIcons(event.target.checked)} /> Mirror directional icons</label>
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="font-medium text-slate-100">{isRtl ? "سجل الطلبات" : "Order timeline"}</div>
              <p className="mt-2">{isRtl ? "حافظ على اتجاه المعرفات التقنية من اليسار إلى اليمين." : "Preview how order IDs appear alongside mirrored controls."}</p>
              <p className="mt-2" dir="ltr">Order ID: ORD-2048-PLATFORM</p>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Direction decision</div>
              <p className="mt-2">{guidance}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Checks</div>
              <ul className="mt-2 space-y-2">{rtlChecks.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
