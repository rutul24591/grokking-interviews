import AnalyticsLab from "./analytics-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Trace funnel drop-off before you redesign the landing path</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app models a content-to-signup funnel, compares healthy versus degraded traffic, and shows how recovery work changes downstream checkout conversion.
        </p>
        <AnalyticsLab />
      </div>
    </main>
  );
}
