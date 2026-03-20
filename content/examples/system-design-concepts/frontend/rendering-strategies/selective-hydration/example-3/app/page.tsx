import Demo from "@/app/_components/Demo";

type PageProps = {
  searchParams?: Promise<{ mode?: "coarse" | "fine" }>;
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const mode = params.mode ?? "fine";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Selective Hydration: Boundary Placement</h1>
        <p className="mt-1 text-sm text-slate-300">
          Mode: <span className="font-mono">{mode}</span>
        </p>

        <div className="mt-6 flex gap-2 text-sm">
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=fine"
          >
            mode=fine
          </a>
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=coarse"
          >
            mode=coarse
          </a>
        </div>

        <div className="mt-6">
          <Demo mode={mode} />
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Fine-grained boundaries preserve interactivity for unrelated controls while slower islands hydrate later.
        </div>
      </div>
    </main>
  );
}

