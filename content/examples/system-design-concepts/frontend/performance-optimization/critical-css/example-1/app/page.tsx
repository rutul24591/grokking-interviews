type Story = {
  title: string;
  summary: string;
  bullets: string[];
};

async function getStory(): Promise<Story> {
  const origin = process.env.ORIGIN_API?.trim() || "http://localhost:4140";
  const res = await fetch(`${origin}/story`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Story;
}

export default async function Page() {
  const story = await getStory();

  return (
    <main>
      <section className="hero">
        <div className="hero-panel">
          <div className="eyebrow">Critical viewport styles</div>
          <h1>{story.title}</h1>
          <p>{story.summary}</p>
        </div>
      </section>

      <section className="detail-shell">
        <div className="detail-panel">
          <h2 className="detail-title">Below-the-fold details</h2>
          <ul className="detail-list">
            {story.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
