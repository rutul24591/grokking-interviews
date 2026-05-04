export type FormSnapshot = {
  fields: Record<string, { label: string; value: unknown }>;
  locale: string;
};

export type Suggestion = {
  fieldId: string;
  value: unknown;
  confidence: number; // 0..1
  rationale: string; // short explanation for user trust
  source: "ai" | "rule" | "import";
};

export type SuggestionChunk = {
  suggestions: Suggestion[];
  done: boolean;
};

export type SuggestionEngine = {
  stream: (input: FormSnapshot) => AsyncGenerator<SuggestionChunk, void, void>;
};

