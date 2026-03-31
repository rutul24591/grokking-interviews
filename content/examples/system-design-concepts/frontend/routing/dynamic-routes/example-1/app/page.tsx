import DynamicRoutesLab from "./dynamic-routes-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#ecfeff_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Dynamic route resolution for typed content</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app maps route segments to content types and demonstrates why slug resolution should stay deterministic and cache-friendly.</p>
        <DynamicRoutesLab />
      </div>
    </main>
  );
}
