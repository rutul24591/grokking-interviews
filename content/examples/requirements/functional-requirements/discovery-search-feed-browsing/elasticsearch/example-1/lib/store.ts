export type SearchResult = {
  id: string;
  title: string;
  score: number;
  explanation: string;
  matchedFields: string[];
  analyzer: "standard" | "synonym";
};

export type SearchState = {
  query: string;
  analyzer: "standard" | "synonym";
  tookMs: number;
  totalHits: number;
  queryHistory: string[];
  warnings: string[];
  results: SearchResult[];
  lastMessage: string;
};

export const searchState: SearchState = {
  query: "distributed systems",
  analyzer: "standard",
  tookMs: 18,
  totalHits: 3,
  queryHistory: ["distributed systems", "feed ranking", "search indexing"],
  warnings: [],
  results: [
    { id: "a1", title: "Distributed Systems Basics", score: 9.8, explanation: "title match + tag boost", matchedFields: ["title", "tags"], analyzer: "standard" },
    { id: "a2", title: "Scaling Search Infrastructure", score: 8.7, explanation: "body match + freshness boost", matchedFields: ["summary"], analyzer: "standard" },
    { id: "a3", title: "Feed Ranking in Large Systems", score: 7.6, explanation: "semantic similarity", matchedFields: ["semantic"], analyzer: "synonym" }
  ],
  lastMessage: "The standard analyzer is returning lexical matches from the simulated index."
};
