export type SearchSuggestion = {
  id: string;
  label: string;
  source: "history" | "popular" | "index";
  type: "query" | "topic" | "author";
};

export type SearchBarState = {
  currentQuery: string;
  submitted: string;
  recentQueries: string[];
  suggestions: SearchSuggestion[];
  selectedSuggestionId: string | null;
  validation: "ready" | "empty" | "too-long";
  estimatedResultCount: number;
  searchMode: "suggestions" | "recent" | "results";
  lastMessage: string;
};

const corpus: SearchSuggestion[] = [
  { id: "q1", label: "system design interview", source: "popular", type: "query" },
  { id: "q2", label: "system design book", source: "popular", type: "query" },
  { id: "q3", label: "search ranking", source: "index", type: "topic" },
  { id: "q4", label: "search analytics", source: "index", type: "topic" },
  { id: "q5", label: "feed generation", source: "index", type: "topic" },
  { id: "q6", label: "faceted search", source: "index", type: "topic" },
  { id: "q7", label: "martin kleppmann", source: "popular", type: "author" }
];

export const searchCorpus = corpus;

export const searchBarState: SearchBarState = {
  currentQuery: "system design",
  submitted: "system design",
  recentQueries: ["circuit breaker", "query caching", "sso integrations"],
  suggestions: corpus.slice(0, 4),
  selectedSuggestionId: "q1",
  validation: "ready",
  estimatedResultCount: 124,
  searchMode: "results",
  lastMessage: "Suggestions are blended from recent history, popular queries, and index-backed prefixes."
};
