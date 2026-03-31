import StreamPanel from "./stream-panel";
export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#ecfeff_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Consume the response as the server produces it</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">The client reads a chunked text stream progressively instead of waiting for the full payload to finish.</p>
        <StreamPanel />
      </div>
    </main>
  );
}
