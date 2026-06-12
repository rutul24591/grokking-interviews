export type MatchReason = "exact" | "alias" | "keyboard-adjacent" | "phonetic" | "semantic";
export interface Candidate { id: string; score: number; reason: MatchReason; label: string }

const penalty: Record<MatchReason, number> = {
  exact: 0,
  alias: 0.05,
  "keyboard-adjacent": 0.15,
  phonetic: 0.22,
  semantic: 0.35,
};

export function rankCandidates(candidates: Candidate[]) {
  return candidates
    .map((candidate) => ({ ...candidate, finalScore: candidate.score - penalty[candidate.reason] }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

export function runExactMatchScenario() {
  return rankCandidates([
    { id: "brand-apl", label: "APL Logistics", score: 0.72, reason: "exact" },
    { id: "brand-apple", label: "Apple", score: 0.93, reason: "keyboard-adjacent" },
  ]);
}
