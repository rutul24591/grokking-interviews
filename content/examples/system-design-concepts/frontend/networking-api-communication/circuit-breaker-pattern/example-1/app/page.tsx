import BreakerPanel from "./breaker-panel";
export default function Page() {
  return <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#fef2f2_100%)] text-slate-900"><div className="mx-auto max-w-5xl px-6 py-10"><h1 className="font-serif text-5xl tracking-tight">Stop calling the upstream when it is already failing</h1><p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app trips a circuit after repeated upstream failures and serves a safe fallback while the breaker cools down.</p><BreakerPanel /></div></main>;
}
