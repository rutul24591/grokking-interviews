import LeakPreventionLab from "./leak-prevention-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff7ed_0%,_#eef2ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Prevent memory leaks before long sessions degrade</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app simulates several leak sources and lets you clean them up to see how retained objects fall back to budget.</p>
        <LeakPreventionLab />
      </div>
    </main>
  );
}
