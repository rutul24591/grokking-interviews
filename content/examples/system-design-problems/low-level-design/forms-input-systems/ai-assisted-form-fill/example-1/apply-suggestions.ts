import type { Suggestion } from "./suggestion-engine";

export type Provenance = {
  suggestedAt: number;
  confidence: number;
  rationale: string;
  source: Suggestion["source"];
};

export type AppliedSuggestion = {
  fieldId: string;
  value: unknown;
  provenance: Provenance;
};

export function applySuggestions(args: {
  current: Record<string, unknown>;
  suggestions: Suggestion[];
  minConfidence: number;
}) {
  const { current, suggestions, minConfidence } = args;
  const next = { ...current };
  const applied: AppliedSuggestion[] = [];

  for (const s of suggestions) {
    if (s.confidence < minConfidence) continue;
    // Human-in-the-loop: in UI, show a diff and let user accept/reject.
    next[s.fieldId] = s.value;
    applied.push({
      fieldId: s.fieldId,
      value: s.value,
      provenance: {
        suggestedAt: Date.now(),
        confidence: s.confidence,
        rationale: s.rationale,
        source: s.source,
      },
    });
  }

  return { next, applied };
}

