'use client';
import { useState, useRef, useCallback, useEffect } from 'react';

interface GeocodeResult {
  id: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
}

interface MapSearchProps {
  onResultSelect: (result: GeocodeResult) => void;
  placeholder?: string;
  geocodeFn?: (query: string) => Promise<GeocodeResult[]>;
  className?: string;
  debounceMs?: number;
}

// Stub geocode - replace with real provider (Mapbox, Google Places, Nominatim, etc.)
async function stubGeocode(query: string): Promise<GeocodeResult[]> {
  if (!query || query.length < 2) return [];
  // Simulated results
  return [
    { id: '1', displayName: `${query}, City Center`, lat: 40.7128, lng: -74.006, type: 'locality' },
    { id: '2', displayName: `${query} Street, Downtown`, lat: 40.758, lng: -73.9855, type: 'address' },
    { id: '3', displayName: `${query} Park`, lat: 40.7829, lng: -73.9654, type: 'park' },
  ].filter((r) => r.displayName.toLowerCase().includes(query.toLowerCase()));
}

export function MapSearch({
  onResultSelect,
  placeholder = 'Search places...',
  geocodeFn = stubGeocode,
  className = '',
  debounceMs = 300,
}: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const data = await geocodeFn(query);
        if (!controller.signal.aborted) {
          setResults(data);
          setIsOpen(data.length > 0);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Search failed');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      controllerRef.current?.abort();
    };
  }, [query, geocodeFn, debounceMs]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(results.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(-1, i - 1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onResultSelect(results[activeIndex]);
        setQuery(results[activeIndex].displayName);
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [isOpen, results, activeIndex, onResultSelect]
  );

  const handleSelect = useCallback(
    (result: GeocodeResult) => {
      setQuery(result.displayName);
      setIsOpen(false);
      onResultSelect(result);
    },
    [onResultSelect]
  );

  const handleBlur = useCallback(() => {
    // Delay close to allow click on result
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="map-search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500">{error}</span>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          id="map-search-listbox"
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {results.map((result, i) => (
            <li
              key={result.id}
              id={`search-result-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`px-4 py-2.5 cursor-pointer text-sm flex items-center gap-3 ${
                i === activeIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(result)}
            >
              <span className="text-gray-400">
                {result.type === 'locality' ? '🏙️' : result.type === 'address' ? '📍' : '🌳'}
              </span>
              <div>
                <p className="font-medium">{result.displayName}</p>
                <p className="text-xs text-gray-500">{result.lat.toFixed(4)}, {result.lng.toFixed(4)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
