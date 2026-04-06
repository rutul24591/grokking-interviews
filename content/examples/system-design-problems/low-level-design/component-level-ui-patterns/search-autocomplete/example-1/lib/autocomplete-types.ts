// Generic suggestion shape
export interface Suggestion<T = Record<string, unknown>> {
  id: string;
  title: string;
  subtitle?: string;
  payload?: T;
}

// Cache entry shape
export interface CacheEntry<T = Record<string, unknown>> {
  data: Suggestion<T>[];
  timestamp: number;
}

// State machine states
export type AutocompleteState = 'idle' | 'loading' | 'success' | 'error';

// Reducer action types
export type AutocompleteAction<T = Record<string, unknown>> =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Suggestion<T>[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_HIGHLIGHT'; payload: number }
  | { type: 'SELECT'; payload: Suggestion<T> }
  | { type: 'RESET' }
  | { type: 'CLOSE_DROPDOWN' };

// Reducer state shape
export interface AutocompleteStateShape<T = Record<string, unknown>> {
  query: string;
  suggestions: Suggestion<T>[];
  highlightedIndex: number;
  state: AutocompleteState;
  selectedSuggestion: Suggestion<T> | null;
  isDropdownOpen: boolean;
  error: string | null;
}

// Component props
export interface AutocompleteProps<T = Record<string, unknown>> {
  fetchSuggestions: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  onSelect: (suggestion: Suggestion<T>) => void;
  debounceMs?: number;
  maxVisible?: number;
  cacheSize?: number;
  minQueryLength?: number;
  placeholder?: string;
  className?: string;
}

// Highlight segment
export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}
