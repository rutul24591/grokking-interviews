"use client";

import { useMemo, useState } from "react";
import { localeCandidates, localePolicies, localeSources } from "@/lib/store";

export default function Page() {
  const [urlLocale, setUrlLocale] = useState("en");
  const [savedPreference, setSavedPreference] = useState("fr");
  const [acceptLanguage, setAcceptLanguage] = useState("ar");
  const [geoFallback, setGeoFallback] = useState("ja");
  const [forcedLocale, setForcedLocale] = useState("");

  const resolved = useMemo(() => forcedLocale || urlLocale || savedPreference || acceptLanguage || geoFallback || "en", [forcedLocale, urlLocale, savedPreference, acceptLanguage, geoFallback]);
  const explanation = useMemo(() => {
    if (forcedLocale) return `Force locale ${forcedLocale} for the current experiment or compliance requirement.`;
    if (urlLocale) return `Use ${urlLocale} because the route explicitly requested that locale.`;
    if (savedPreference) return `Use ${savedPreference} because the user saved a profile preference.`;
    if (acceptLanguage) return `Use ${acceptLanguage} from Accept-Language.`;
    return `Fallback to ${geoFallback}.`;
  }, [forcedLocale, urlLocale, savedPreference, acceptLanguage, geoFallback]);

  const redirectWarning = useMemo(() => {
    if (forcedLocale && urlLocale && forcedLocale !== urlLocale) return `Redirect ${urlLocale} route traffic to ${forcedLocale}.`;
    if (savedPreference && acceptLanguage && savedPreference !== acceptLanguage) return `Persist ${savedPreference} after login and ignore browser hints.`;
    return "No redirect or persistence conflict detected.";
  }, [forcedLocale, urlLocale, savedPreference, acceptLanguage]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Frontend i18n/l10n</p>
        <h1 className="mt-2 text-3xl font-semibold">Locale detection console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Resolve locale from route, profile, browser, and forced overrides while preserving article/example parity.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            {[
              ["URL locale", urlLocale, setUrlLocale],
              ["Saved preference", savedPreference, setSavedPreference],
              ["Accept-Language", acceptLanguage, setAcceptLanguage],
              ["Geo fallback", geoFallback, setGeoFallback],
              ["Forced locale", forcedLocale, setForcedLocale]
            ].map(([label, value, setValue]) => (
              <label key={label as string} className="block">
                <span className="font-medium">{label as string}</span>
                <select value={value as string} onChange={(event) => (setValue as (next: string) => void)(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                  <option value="">None</option>
                  {localeCandidates.map((candidate) => <option key={candidate} value={candidate}>{candidate}</option>)}
                </select>
              </label>
            ))}
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Resolved locale</div>
              <div className="mt-2 text-2xl font-semibold text-slate-100">{resolved}</div>
              <p className="mt-2">{explanation}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Conflict review</div>
              <p className="mt-2">{redirectWarning}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Priority and policies</div>
              <ul className="mt-2 space-y-2">{localeSources.concat(localePolicies).map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
