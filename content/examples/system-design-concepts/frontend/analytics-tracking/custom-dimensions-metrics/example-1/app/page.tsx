import AnalyticsLab from "./analytics-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#fefce8_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Capture high-value dimensions without breaking the reporting pipeline</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app validates custom dimensions, rejects unsafe cardinality spikes, and shows how analytics reports roll up by approved keys only.
        </p>
        <AnalyticsLab />
      </div>
    </main>
  );
}
