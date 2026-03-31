import RateLimitPanel from "./rate-limit-panel";
export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eff6ff_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Stay within the API budget before the server pushes back</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app bursts article search requests against a rate-limited origin and visualizes success, 429s, and retry-after timing.</p>
        <RateLimitPanel />
      </div>
    </main>
  );
}
