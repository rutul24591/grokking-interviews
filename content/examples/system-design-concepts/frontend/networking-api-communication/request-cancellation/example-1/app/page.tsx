import CancellationWorkbench from "./request-cancellation-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ede9fe_100%)] text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Cancel stale requests before they paint the wrong article state</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          The client issues overlapping search requests as the user types, aborts older work, and only applies the latest response.
        </p>
        <CancellationWorkbench />
      </div>
    </main>
  );
}
