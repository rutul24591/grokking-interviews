'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

// Minimal PDF.js text content types
interface TextItem {
  str: string;
  dir: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL: boolean;
}

interface TextContent {
  items: TextItem[];
  styles: Record<string, unknown>;
}

interface SearchMatch {
  page: number;
  text: string;
  position: number;
  length: number;
  context: string;
}

interface UsePdfSearchOptions {
  pdfDoc: unknown; // PDFDocumentProxy from pdfjs-dist
  numPages: number;
  debounceMs?: number;
  contextChars?: number;
}

interface UsePdfSearchReturn {
  matches: SearchMatch[];
  currentMatchIndex: number;
  searching: boolean;
  error: string | null;
  query: string;
  setQuery: (q: string) => void;
  goToMatch: (index: number) => void;
  nextMatch: () => void;
  prevMatch: () => void;
}

/**
 * Hook for PDF text content extraction and search.
 * Extracts text from all pages (or lazily per page), finds matches,
 * and navigates between them.
 */
export function usePdfSearch({
  pdfDoc,
  numPages,
  debounceMs = 300,
  contextChars = 40,
}: UsePdfSearchOptions): UsePdfSearchReturn {
  const [query, setQueryState] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryRef = useRef(query);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageTextCacheRef = useRef<Map<number, string>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!q || q.length < 2) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      setSearching(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(q);
    }, debounceMs);
  }, [debounceMs]);

  /**
   * Extract text content from a single PDF page.
   * Caches results to avoid re-extraction on subsequent searches.
   */
  const extractPageText = useCallback(
    async (pageNum: number): Promise<string> => {
      if (pageTextCacheRef.current.has(pageNum)) {
        return pageTextCacheRef.current.get(pageNum)!;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfjsLib = await import('pdfjs-dist');
      const doc = pdfDoc as any;
      if (!doc) return '';

      try {
        const page = await doc.getPage(pageNum);
        const textContent = (await page.getTextContent()) as TextContent;
        const text = textContent.items.map((item: TextItem) => item.str).join(' ');
        pageTextCacheRef.current.set(pageNum, text);
        return text;
      } catch {
        return '';
      }
    },
    [pdfDoc]
  );

  /**
   * Find all occurrences of the query string across all pages.
   */
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!pdfDoc || !searchQuery || searchQuery.length < 2) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setSearching(true);
      setError(null);
      const results: SearchMatch[] = [];

      try {
        for (let p = 1; p <= numPages; p++) {
          if (controller.signal.aborted) return;

          const pageText = await extractPageText(p);
          const lowerText = pageText.toLowerCase();
          const lowerQuery = searchQuery.toLowerCase();
          let startIndex = 0;

          while (true) {
            const pos = lowerText.indexOf(lowerQuery, startIndex);
            if (pos === -1) break;

            // Extract context around the match
            const contextStart = Math.max(0, pos - contextChars);
            const contextEnd = Math.min(pageText.length, pos + searchQuery.length + contextChars);
            const context =
              (contextStart > 0 ? '...' : '') +
              pageText.slice(contextStart, contextEnd) +
              (contextEnd < pageText.length ? '...' : '');

            results.push({
              page: p,
              text: searchQuery,
              position: pos,
              length: searchQuery.length,
              context,
            });

            startIndex = pos + searchQuery.length;
          }
        }

        if (!controller.signal.aborted) {
          setMatches(results);
          setCurrentMatchIndex(results.length > 0 ? 0 : -1);
          setSearching(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Search failed');
          setSearching(false);
        }
      }
    },
    [pdfDoc, numPages, extractPageText, contextChars]
  );

  const goToMatch = useCallback(
    (index: number) => {
      if (matches.length === 0) return;
      const clamped = Math.max(0, Math.min(index, matches.length - 1));
      setCurrentMatchIndex(clamped);
    },
    [matches]
  );

  const nextMatch = useCallback(() => {
    goToMatch(currentMatchIndex + 1);
  }, [currentMatchIndex, goToMatch]);

  const prevMatch = useCallback(() => {
    goToMatch(currentMatchIndex - 1);
  }, [currentMatchIndex, goToMatch]);

  // Cleanup debounce timer and abort controller on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    matches,
    currentMatchIndex,
    searching,
    error,
    query,
    setQuery,
    goToMatch,
    nextMatch,
    prevMatch,
  };
}
