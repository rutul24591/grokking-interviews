export type TagType = 'default' | 'user' | 'label' | 'category';

export interface Tag<T = Record<string, unknown>> {
  id: string;
  label: string;
  type?: TagType;
  avatarUrl?: string;
  color?: string;
  category?: string;
  metadata?: T;
}

export interface Suggestion<T = Record<string, unknown>> extends Tag<T> {
  groupId?: string;
  matchScore?: number;
}

export interface SelectState<T = Record<string, unknown>> {
  selected: Tag<T>[];
  inputValue: string;
  isOpen: boolean;
  highlightedIndex: number;
  isLoading: boolean;
  config: MultiSelectConfig<T>;
}

export type GroupByStrategy = 'category' | 'type' | 'recent' | 'none';

export interface MultiSelectConfig<T = Record<string, unknown>> {
  maxSelections?: number;
  debounceMs?: number;
  allowCreate?: boolean;
  groupBy?: GroupByStrategy;
  cacheSize?: number;
  fetcher?: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  validator?: (label: string) => boolean | { valid: boolean; message: string };
  delimiter?: RegExp;
  namespace?: string;
  placeholder?: string;
  disabled?: boolean;
  initialSelected?: Tag<T>[];
}

export interface SuggestionGroup<T = Record<string, unknown>> {
  id: string;
  label: string;
  suggestions: Suggestion<T>[];
}

export type CacheEntry<T = Record<string, unknown>> = {
  query: string;
  suggestions: Suggestion<T>[];
  accessedAt: number;
};
