import CompoundTabsDemo from "./compound-tabs-demo";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#faf5ff_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Build expressive APIs with compound components</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app coordinates a tabbed learning console with shared state, keyboard-safe switching, and contextual summaries without prop drilling through every child.
        </p>
        <CompoundTabsDemo />
      </div>
    </main>
  );
}
