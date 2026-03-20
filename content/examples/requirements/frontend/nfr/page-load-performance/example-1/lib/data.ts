export type Item = { id: string; title: string; score: number };

export async function criticalData() {
  return {
    header: "Critical (above-the-fold) data",
    items: [
      { id: "c1", title: "Reduce render-blocking work", score: 98 },
      { id: "c2", title: "Avoid request waterfalls", score: 94 },
      { id: "c3", title: "Ship less JS", score: 91 }
    ]
  };
}

export async function slowData(delayMs: number) {
  await new Promise((r) => setTimeout(r, delayMs));
  const items: Item[] = Array.from({ length: 18 }, (_, i) => ({
    id: `s${i + 1}`,
    title: `Deferred recommendation #${i + 1}`,
    score: 70 + ((i * 7) % 29)
  }));
  return { header: `Deferred data (${delayMs}ms artificial latency)`, items };
}

