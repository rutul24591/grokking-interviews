import FilterableBoard from "./filterable-board";

type Story = {
  title: string;
  summary: string;
};

async function getStory(): Promise<Story> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4180";
  const response = await fetch(`${origin}/story`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as Story;
}

export default async function Page() {
  const story = await getStory();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf7_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-700">Render Efficiency</p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight">{story.title}</h1>
          <p className="mt-5 text-base leading-7 text-slate-700">{story.summary}</p>
        </header>

        <FilterableBoard />
      </div>
    </main>
  );
}
