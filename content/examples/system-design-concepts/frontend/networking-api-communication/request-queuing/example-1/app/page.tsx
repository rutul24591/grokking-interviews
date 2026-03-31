import QueueWorkbench from "./queue-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eff6ff_0%,_#fefce8_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Queue network work instead of stampeding the origin</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app stages article analytics jobs behind a client-side queue, limits concurrency, and surfaces backlog pressure to the operator.
        </p>
        <QueueWorkbench />
      </div>
    </main>
  );
}
