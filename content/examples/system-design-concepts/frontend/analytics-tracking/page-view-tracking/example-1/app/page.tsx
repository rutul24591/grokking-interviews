import AnalyticsLab from "./analytics-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#fdf2f8_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Track SPA page views without double-counting route changes</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app simulates article navigation, emits canonical page views, and highlights how referrer chains and duplicate suppression work in a modern frontend router.
        </p>
        <AnalyticsLab />
      </div>
    </main>
  );
}
