import { useState, useEffect, useRef, useCallback } from 'react';
import { getGlobalCache } from '../lib/tag-cache';
import type { Suggestion, SuggestionGroup, Tag } from '../lib/multi-select-types';

interface UseSuggestionsOptions<T> {
  query: string;
  fetcher: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  selectedTags: Tag<T>[];
  groupBy?: 'category' | 'type' | 'recent' | 'none';
  namespace?: string;
}

interface UseSuggestionsResult<T> {
  groups: SuggestionGroup<T>[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  retry: () => void;
}

export function useSuggestions<T = Record<string, unknown>>(
  options: UseSuggestionsOptions<T>
): UseSuggestionsResult<T> {
  const { query, fetcher, selectedTags, groupBy = 'category', namespace = 'default' } = options;

  const [groups, setGroups] = useState<SuggestionGroup<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cache = getGlobalCache<T>({ namespace });

  const selectedIds = new Set(selectedTags.map((t) => t.id));
  const selectedLabels = new Set(selectedTags.map((t) => t.label.toLowerCase()));

  const filterSelected = useCallback(
    (suggestions: Suggestion<T>[]): Suggestion<T>[] => {
      return suggestions.filter(
        (s) => !selectedIds.has(s.id) && !selectedLabels.has(s.label.toLowerCase())
      );
    },
    [selectedIds, selectedLabels]
  );

  const groupSuggestions = useCallback(
    (suggestions: Suggestion<T>[]): SuggestionGroup<T>[] => {
      if (groupBy === 'none' || !suggestions.length) {
        return suggestions.length
          ? [{ id: 'all', label: 'Suggestions', suggestions }]
          : [];
      }

      const groupMap = new Map<string, Suggestion<T>[]>();

      for (const suggestion of suggestions) {
        let groupId: string;
        let groupLabel: string;

        if (groupBy === 'category') {
          groupId = suggestion.category ?? 'uncategorized';
          groupLabel = suggestion.category ?? 'Uncategorized';
        } else if (groupBy === 'type') {
          groupId = suggestion.type ?? 'default';
          groupLabel = (suggestion.type ?? 'Default').charAt(0).toUpperCase() +
            (suggestion.type ?? 'Default').slice(1);
        } else if (groupBy === 'recent') {
          groupId = suggestion.groupId ?? 'suggestions';
          groupLabel = suggestion.groupId ?? 'Suggestions';
        } else {
          groupId = 'all';
          groupLabel = 'Suggestions';
        }

        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, []);
        }
        groupMap.get(groupId)!.push(suggestion);
      }

      return Array.from(groupMap.entries()).map(([id, suggestions]) => ({
        id,
        label: groupMap.size > 1
          ? (groupBy === 'recent' && id === 'recent' ? 'Recent' : id.charAt(0).toUpperCase() + id.slice(1))
          : 'Suggestions',
        suggestions,
      }));
    },
    [groupBy]
  );

  const executeFetch = useCallback(async () => {
    if (!query.trim()) {
      setGroups([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Check cache
    const cached = cache.get(query);
    if (cached) {
      const filtered = filterSelected(cached);
      setGroups(groupSuggestions(filtered));
      setIsLoading(false);
      setError(null);
      return;
    }

    // Cancel in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const results = await fetcher(query, controller.signal);
      cache.set(query, results);
      const filtered = filterSelected(results);
      setGroups(groupSuggestions(filtered));
      setIsLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
      setIsLoading(false);
    }
  }, [query, fetcher, cache, filterSelected, groupSuggestions]);

  // Retry function for error state
  const retry = useCallback(() => {
    executeFetch();
  }, [executeFetch]);

  useEffect(() => {
    executeFetch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeFetch]);

  const totalCount = groups.reduce((sum, g) => sum + g.suggestions.length, 0);

  return { groups, isLoading, error, totalCount, retry };
}
