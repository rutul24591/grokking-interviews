import type { Command, CommandResult } from './command-palette-types';

export function fuzzyMatch(query: string, text: string, keywords: string[] = []): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const kws = keywords.map((k) => k.toLowerCase());

  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 80;

  let score = 0;
  let qi = 0;
  let consecutive = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 10 + (consecutive > 0 ? 5 : 0);
      qi++;
      consecutive++;
    } else {
      consecutive = 0;
    }
  }

  if (qi < q.length) return 0;
  if (kws.some((kw) => kw.includes(q) || q.includes(kw))) score += 20;

  return score >= 50 ? score : 0;
}

export function filterAndRank(commands: Command[], query: string): CommandResult[] {
  if (!query.trim()) return commands.map((c) => ({ ...c, score: 50 }));
  const results = commands
    .map((cmd) => {
      const score = fuzzyMatch(query, cmd.label, cmd.keywords);
      return score > 0 ? { ...cmd, score } : null;
    })
    .filter((r): r is CommandResult => r !== null)
    .sort((a, b) => b.score - a.score);
  return results;
}
