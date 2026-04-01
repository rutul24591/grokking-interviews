import { NextRequest, NextResponse } from "next/server";
import { searchBarState, searchCorpus, type SearchSuggestion } from "@/lib/store";

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildSuggestions(query: string, recentQueries: string[]) {
  if (!query) {
    return recentQueries.slice(0, 4).map((item, index) => ({
      id: `recent-${index}`,
      label: item,
      source: "history" as const,
      type: "query" as const
    }));
  }

  const historyMatches = recentQueries
    .filter((item) => item.includes(query))
    .map((item, index) => ({
      id: `recent-${index}`,
      label: item,
      source: "history" as const,
      type: "query" as const
    }));

  const prefixMatches = searchCorpus.filter((item) => item.label.startsWith(query));
  const fuzzyMatches = searchCorpus.filter(
    (item) => !item.label.startsWith(query) && item.label.includes(query)
  );

  return [...historyMatches, ...prefixMatches, ...fuzzyMatches].slice(0, 5);
}

function estimateResults(query: string, suggestions: SearchSuggestion[]) {
  if (!query) return 0;
  return Math.max(6, suggestions.length * 18 + Math.min(query.length * 7, 42));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { query: string; selectedSuggestionId?: string | null };
  const query = normalizeQuery(body.query);

  searchBarState.currentQuery = query;
  searchBarState.selectedSuggestionId = body.selectedSuggestionId ?? null;

  if (!query) {
    searchBarState.validation = "empty";
    searchBarState.suggestions = buildSuggestions(query, searchBarState.recentQueries);
    searchBarState.searchMode = "recent";
    searchBarState.estimatedResultCount = 0;
    searchBarState.lastMessage = "Empty input falls back to recent searches instead of issuing a low-signal query.";
    return NextResponse.json(searchBarState);
  }

  if (query.length > 60) {
    searchBarState.validation = "too-long";
    searchBarState.searchMode = "suggestions";
    searchBarState.suggestions = [];
    searchBarState.estimatedResultCount = 0;
    searchBarState.lastMessage = "Rejected the query because it exceeds the search input length budget.";
    return NextResponse.json(searchBarState);
  }

  searchBarState.validation = "ready";
  searchBarState.submitted = query;
  searchBarState.recentQueries = [query, ...searchBarState.recentQueries.filter((item) => item !== query)].slice(0, 5);
  searchBarState.suggestions = buildSuggestions(query, searchBarState.recentQueries);
  searchBarState.searchMode = "results";
  searchBarState.estimatedResultCount = estimateResults(query, searchBarState.suggestions);
  searchBarState.lastMessage = `Updated suggestions and estimated result volume for "${query}".`;
  return NextResponse.json(searchBarState);
}
