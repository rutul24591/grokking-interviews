import BatchBoard from "./batch-board";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#fef3c7_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Batch related article requests into one origin round trip</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          The UI requests multiple article cards together and compares the single batch response against separate client-side intent.
        </p>
        <BatchBoard />
      </div>
    </main>
  );
}
