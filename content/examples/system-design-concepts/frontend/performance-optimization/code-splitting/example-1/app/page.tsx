import LoadDiff from "./load-diff";

type Topic = {
  id: string;
  title: string;
  summary: string;
};

async function getTopics(): Promise<Topic[]> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4120";
  const res = await fetch(`${origin}/topics`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Topic[];
}

export default async function Page() {
  const topics = await getTopics();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8f9ff_0%,_#eef1fa_100%)] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-5xl tracking-tight">Code splitting</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          The initial route ships the article feed. The expensive comparison workflow becomes its own chunk and
          loads only when the user asks for it.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <article key={topic.id} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{topic.summary}</p>
            </article>
          ))}
        </div>
        <LoadDiff />
      </div>
    </main>
  );
}

