import HocWorkbench from "./hoc-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#ecfeff_0%,_#faf5ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Wrap cross-cutting concerns with HOCs</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app wraps an article feed with entitlement, audit logging, and feature-flag guards so cross-cutting behavior stays centralized instead of duplicated in each card.
        </p>
        <HocWorkbench />
      </div>
    </main>
  );
}
