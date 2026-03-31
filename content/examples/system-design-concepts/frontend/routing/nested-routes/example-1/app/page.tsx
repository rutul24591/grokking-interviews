import NestedRoutesLab from "./nested-routes-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f0fdf4_0%,_#f8fafc_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Nested routes for scoped layouts and data</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">This app shows how parent and child route segments define layout ownership and data boundaries.</p>
        <NestedRoutesLab />
      </div>
    </main>
  );
}
