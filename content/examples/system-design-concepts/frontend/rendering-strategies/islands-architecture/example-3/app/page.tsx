import InspectorBigProps from "@/app/_components/InspectorBigProps";
import InspectorIdOnly from "@/app/_components/InspectorIdOnly";

type PageProps = {
  searchParams?: Promise<{ mode?: "big" | "id" }>;
};

function makeLargeBody() {
  return (
    "This is a simulated large article body. ".repeat(900) +
    "In production, avoid passing huge serialized objects into client islands."
  );
}

export default async function Page({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const mode = params.mode ?? "id";

  const article = { id: "a-1", body: makeLargeBody() };
  const approxSerializedChars = JSON.stringify(article).length;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Islands: Big Props vs Id-only</h1>
        <p className="mt-1 text-sm text-slate-300">
          Mode: <span className="font-mono">{mode}</span> · server JSON chars:{" "}
          <span className="font-mono">{approxSerializedChars}</span>
        </p>

        <div className="mt-6 flex gap-2 text-sm">
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=big"
          >
            mode=big
          </a>
          <a
            className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-slate-200 hover:border-slate-600"
            href="/?mode=id"
          >
            mode=id
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {mode === "big" ? (
            <InspectorBigProps article={article} />
          ) : (
            <InspectorIdOnly articleId={article.id} />
          )}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Guidance
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-100">
              <li>Prefer minimal props across the server/client boundary.</li>
              <li>Pass identifiers; fetch details inside the island when needed.</li>
              <li>Batch / dedupe island fetches to avoid waterfalls.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

