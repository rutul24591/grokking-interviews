'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

interface PDFSearchProps {
  onSearch: (query: string, options?: { caseSensitive?: boolean; wholeWord?: boolean }) => Promise<SearchMatch[]>;
  onPageChange?: (page: number) => void;
  className?: string;
}

interface SearchMatch {
  page: number;
  text: string;
  position: number;
  length: number;
}

export function PDFSearch({ onSearch, onPageChange, className = '' }: PDFSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen]);

  const doSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        setCurrentMatchIndex(-1);
        return;
      }

      setSearching(true);
      setError(null);
      try {
        const matches = await onSearch(searchQuery, { caseSensitive, wholeWord });
        setResults(matches);
        setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
        if (matches.length > 0 && onPageChange) {
          onPageChange(matches[0].page);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setSearching(false);
      }
    },
    [onSearch, caseSensitive, wholeWord, onPageChange]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => doSearch(value), 300);
    },
    [doSearch]
  );

  const goToMatch = useCallback(
    (index: number) => {
      if (results.length === 0) return;
      const clamped = Math.max(0, Math.min(index, results.length - 1));
      setCurrentMatchIndex(clamped);
      if (onPageChange) {
        onPageChange(results[clamped].page);
      }
    },
    [results, onPageChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          goToMatch(currentMatchIndex - 1);
        } else {
          goToMatch(currentMatchIndex + 1);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setResults([]);
        setQuery('');
      }
    },
    [currentMatchIndex, goToMatch]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="relative flex-1 max-w-xs">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Find in document..."
          className="w-full pl-8 pr-20 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          aria-label="Search in PDF"
        />
        <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searching && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCaseSensitive(!caseSensitive)}
          className={`px-2 py-1 text-xs rounded border ${caseSensitive ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-pressed={caseSensitive}
          title="Case sensitive"
        >
          Aa
        </button>
        <button
          onClick={() => setWholeWord(!wholeWord)}
          className={`px-2 py-1 text-xs rounded border ${wholeWord ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          aria-pressed={wholeWord}
          title="Whole word"
        >
          W
        </button>
      </div>

      {/* Results count + navigation */}
      {results.length > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {currentMatchIndex + 1} of {results.length}
          </span>
          <button
            onClick={() => goToMatch(currentMatchIndex - 1)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Previous match"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button
            onClick={() => goToMatch(currentMatchIndex + 1)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Next match"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !searching && (
        <span className="text-xs text-gray-500">No results</span>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}

      {/* Close */}
      <button
        onClick={() => { setIsOpen(false); setResults([]); setQuery(''); }}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Close search"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

// Hook to expose the toggle
export function usePDFSearchState() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, toggle, open, close };
}
