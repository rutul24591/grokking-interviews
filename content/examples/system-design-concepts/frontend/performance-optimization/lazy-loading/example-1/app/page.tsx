import LazyWidgets from "./widgets-shell";

type Story = {
  title: string;
  summary: string;
  bullets: string[];
};

async function getStory(): Promise<Story> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4170";
  const response = await fetch(`${origin}/story`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as Story;
}

export default async function Page() {
  const story = await getStory();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fbfbfd_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_24px_70px_rgba(30,41,59,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-700">Lazy Loading</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight">{story.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">{story.summary}</p>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            {story.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <LazyWidgets />
      </div>
    </main>
  );
}
