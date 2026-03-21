type Entry = { value: string; freshUntilMs: number; staleUntilMs: number };

function decide(entry: Entry | null, nowMs: number) {
  if (!entry) return { serve: "miss", revalidate: true };
  if (nowMs <= entry.freshUntilMs) return { serve: "fresh", revalidate: false };
  if (nowMs <= entry.staleUntilMs) return { serve: "stale", revalidate: true };
  return { serve: "expired", revalidate: true };
}

const now = Date.now();
console.log(decide({ value: "v", freshUntilMs: now - 1, staleUntilMs: now + 5000 }, now));

