export type ViewMode = "compact" | "detailed";
export type SearchResultCard = { id: string; title: string; excerpt: string; badges: string[]; matchedTerms: number };
export const searchResultsUiState = {
  viewMode: "detailed" as ViewMode,
  query: "search ranking",
  totalResults: 124,
  results: [
    { id: "s1", title: "Search ranking design", excerpt: "Signals, blending, and ranker health checks.", badges: ["guide", "updated"], matchedTerms: 3 },
    { id: "s2", title: "Ranking regressions", excerpt: "How to detect bad result ordering before users notice.", badges: ["incident"], matchedTerms: 2 },
    { id: "s3", title: "Search analytics", excerpt: "CTR, zero-result queries, and relevance diagnostics.", badges: ["analytics"], matchedTerms: 2 }
  ],
  lastMessage: "Detailed mode surfaces enough context for users to choose the right result quickly."
};
