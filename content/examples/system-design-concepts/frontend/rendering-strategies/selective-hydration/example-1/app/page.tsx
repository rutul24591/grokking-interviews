import SelectiveDemo from "@/app/_components/SelectiveDemo";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Selective Hydration</h1>
        <p className="mt-1 text-sm text-slate-300">
          Demonstrates a suspended hydration boundary + discrete event replay after hydration.
        </p>

        <div className="mt-6">
          <SelectiveDemo />
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Note: Behavior can vary across React/Next versions and dev vs prod. The key concept is that React can delay
          hydrating some boundaries while still preserving UX via event replay/priority.
        </div>
      </div>
    </main>
  );
}

