import DedupBoard from "./request-board";
export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Deduplicate shared reads before they stampede the origin</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">The board mounts multiple consumers of the same user payload and serves them through one in-flight promise.</p>
        <DedupBoard />
      </div>
    </main>
  );
}
