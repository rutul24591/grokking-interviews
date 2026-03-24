export type Candidate = {
  href: string;
  as: "image" | "script" | "style" | "font";
  bytes: number;
  confidence: number; // 0..1 probability it will be used soon
};

export type Decision = {
  chosen: Candidate[];
  skipped: Array<Candidate & { reason: string }>;
};

export function choosePreloads(candidates: Candidate[], maxBytes: number, maxCount: number): Decision {
  const unique = new Map<string, Candidate>();
  for (const c of candidates) {
    const key = `${c.as}:${c.href}`;
    if (!unique.has(key)) unique.set(key, c);
  }

  const ranked = [...unique.values()].sort((a, b) => {
    // prefer confidence, then smaller, then stable ordering
    if (a.confidence !== b.confidence) return b.confidence - a.confidence;
    if (a.bytes !== b.bytes) return a.bytes - b.bytes;
    return (a.as + a.href).localeCompare(b.as + b.href);
  });

  const chosen: Candidate[] = [];
  const skipped: Array<Candidate & { reason: string }> = [];
  let used = 0;

  for (const c of ranked) {
    if (chosen.length >= maxCount) {
      skipped.push({ ...c, reason: "count_budget_exceeded" });
      continue;
    }
    if (used + c.bytes > maxBytes) {
      skipped.push({ ...c, reason: "bytes_budget_exceeded" });
      continue;
    }
    if (c.confidence < 0.6) {
      skipped.push({ ...c, reason: "low_confidence" });
      continue;
    }
    chosen.push(c);
    used += c.bytes;
  }

  return { chosen, skipped };
}

