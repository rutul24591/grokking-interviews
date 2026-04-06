import { useReducer, useRef, useCallback, useMemo } from 'react';
import type {
  Suggestion,
  AutocompleteStateShape,
  AutocompleteAction,
  AutocompleteState,
} from './autocomplete-types';

// Default constants
const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_CACHE_SIZE = 100;
const DEFAULT_MIN_QUERY_LENGTH = 2;

// Reducer function
function autocompleteReducer<T>(
  state: AutocompleteStateShape<T>,
  action: AutocompleteAction<T>
): AutocompleteStateShape<T> {
  switch (action.type) {
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
        highlightedIndex: -1,
        isDropdownOpen: false,
        suggestions: [],
        state: 'idle',
        error: null,
      };
    case 'FETCH_START':
      return {
        ...state,
        state: 'loading',
        isDropdownOpen: false,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        state: 'success',
        suggestions: action.payload,
        highlightedIndex: -1,
        isDropdownOpen: action.payload.length > 0,
        error: null,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        state: 'error',
        error: action.payload,
        suggestions: [],
        isDropdownOpen: false,
      };
    case 'SET_HIGHLIGHT':
      return {
        ...state,
        highlightedIndex: action.payload,
      };
    case 'SELECT':
      return {
        ...state,
        selectedSuggestion: action.payload,
        query: action.payload.title,
        isDropdownOpen: false,
        highlightedIndex: -1,
      };
    case 'RESET':
      return {
        query: '',
        suggestions: [],
        highlightedIndex: -1,
        state: 'idle',
        selectedSuggestion: null,
        isDropdownOpen: false,
        error: null,
      };
    case 'CLOSE_DROPDOWN':
      return {
        ...state,
        isDropdownOpen: false,
        highlightedIndex: -1,
      };
    default:
      return state;
  }
}

// Initial state
function getInitialState<T>(): AutocompleteStateShape<T> {
  return {
    query: '',
    suggestions: [],
    highlightedIndex: -1,
    state: 'idle',
    selectedSuggestion: null,
    isDropdownOpen: false,
    error: null,
  };
}

interface UseAutocompleteOptions<T> {
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  onSelect: (suggestion: Suggestion<T>) => void;
  debounceMs?: number;
  cacheSize?: number;
  minQueryLength?: number;
}

export function useAutocomplete<T = Record<string, unknown>>({
  fetchSuggestions,
  onSelect,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  cacheSize = DEFAULT_CACHE_SIZE,
  minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
}: UseAutocompleteOptions<T>) {
  const [state, dispatch] = useReducer(
    autocompleteReducer<T>,
    undefined,
    getInitialState
  );

  // Refs for debounce timer, cache, and abort controller
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Map<string, Suggestion<T>[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  // Fetch function with cache and abort logic
  const fetchResults = useCallback(
    async (query: string) => {
      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller and request ID
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const currentRequestId = ++requestIdRef.current;

      dispatch({ type: 'FETCH_START' });

      try {
        const results = await fetchSuggestions(query, abortController.signal);

        // Stale response check
        if (currentRequestId !== requestIdRef.current) {
          return; // Discard stale response
        }

        // Store in cache with FIFO eviction
        if (cacheRef.current.size >= cacheSize) {
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey !== undefined) {
            cacheRef.current.delete(firstKey);
          }
        }
        cacheRef.current.set(query, results);

        dispatch({ type: 'FETCH_SUCCESS', payload: results });
      } catch (error) {
        // Don't update state if request was aborted
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        // Stale error check
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch suggestions';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
      }
    },
    [fetchSuggestions, cacheSize]
  );

  // Debounced query handler
  const handleQueryChange = useCallback(
    (query: string) => {
      dispatch({ type: 'SET_QUERY', payload: query });

      // Clear previous debounce timer
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }

      // Don't fetch if query is too short
      if (query.trim().length < minQueryLength) {
        return;
      }

      // Check cache first
      const cachedResults = cacheRef.current.get(query);
      if (cachedResults) {
        dispatch({ type: 'FETCH_SUCCESS', payload: cachedResults });
        return;
      }

      // Schedule new fetch
      debounceTimerRef.current = setTimeout(() => {
        fetchResults(query);
      }, debounceMs);
    },
    [debounceMs, minQueryLength, fetchResults]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { suggestions, highlightedIndex, isDropdownOpen } = state;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isDropdownOpen || suggestions.length === 0) return;
          const nextIndex =
            highlightedIndex < suggestions.length - 1
              ? highlightedIndex + 1
              : 0; // Wrap around
          dispatch({ type: 'SET_HIGHLIGHT', payload: nextIndex });
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isDropdownOpen || suggestions.length === 0) return;
          const prevIndex =
            highlightedIndex > 0
              ? highlightedIndex - 1
              : suggestions.length - 1; // Wrap around
          dispatch({ type: 'SET_HIGHLIGHT', payload: prevIndex });
          break;

        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            const selected = suggestions[highlightedIndex];
            dispatch({ type: 'SELECT', payload: selected });
            onSelect(selected);
          }
          break;

        case 'Escape':
          e.preventDefault();
          dispatch({ type: 'CLOSE_DROPDOWN' });
          break;
      }
    },
    [state, onSelect]
  );

  // Mouse selection
  const handleSelect = useCallback(
    (suggestion: Suggestion<T>) => {
      dispatch({ type: 'SELECT', payload: suggestion });
      onSelect(suggestion);
    },
    [onSelect]
  );

  // Hover highlight
  const handleHighlight = useCallback((index: number) => {
    dispatch({ type: 'SET_HIGHLIGHT', payload: index });
  }, []);

  // Close dropdown
  const closeDropdown = useCallback(() => {
    dispatch({ type: 'CLOSE_DROPDOWN' });
  }, []);

  // Cleanup on unmount
  const cleanupRef = useRef<(() => void) | null>(null);
  cleanupRef.current = () => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Memoized return value
  return useMemo(
    () => ({
      state: state.state as AutocompleteState,
      query: state.query,
      suggestions: state.suggestions,
      highlightedIndex: state.highlightedIndex,
      isDropdownOpen: state.isDropdownOpen,
      error: state.error,
      onQueryChange: handleQueryChange,
      onKeyDown: handleKeyDown,
      onSelect: handleSelect,
      onHighlight: handleHighlight,
      closeDropdown,
    }),
    [
      state,
      handleQueryChange,
      handleKeyDown,
      handleSelect,
      onHighlight,
      closeDropdown,
    ]
  );
}
