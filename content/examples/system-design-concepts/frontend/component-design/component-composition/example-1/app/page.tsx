import CompositionWorkbench from "./composition-workbench";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ecfeff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Compose article pages from slots, not inheritance</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app uses slot-based composition to assemble hero, body, and rail content for a system design article page.
        </p>
        <CompositionWorkbench />
      </div>
    </main>
  );
}
