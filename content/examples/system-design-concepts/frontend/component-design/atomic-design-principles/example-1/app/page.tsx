import AtomicCatalog from "./atomic-catalog";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#eef2ff_0%,_#fff7ed_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Build product UI from atoms upward</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app turns an atomic inventory into a real article-page assembly workflow so you can inspect how atoms, molecules, organisms, and templates combine into a production page shell.
        </p>
        <AtomicCatalog />
      </div>
    </main>
  );
}
