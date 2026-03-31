import FormStrategyLab from "./form-strategy-lab";

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fff1f2_0%,_#eff6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Compare controlled and uncontrolled form strategies</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          This app submits the same feedback form with both patterns so you can compare validation, draft state, and DOM ownership trade-offs.
        </p>
        <FormStrategyLab />
      </div>
    </main>
  );
}
