import AnalyticsLab from "./analytics-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f0fdf4_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Reconstruct user journeys across the article research flow</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app records step-by-step journey events for a reader session and visualizes the ordered path that product analysts use for behavioral debugging.
        </p>
        <AnalyticsLab />
      </div>
    </main>
  );
}
