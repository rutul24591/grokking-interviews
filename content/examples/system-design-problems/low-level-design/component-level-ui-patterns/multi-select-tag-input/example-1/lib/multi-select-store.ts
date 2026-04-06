import { create } from 'zustand';
import type { Tag, MultiSelectConfig, SelectState } from './multi-select-types';

interface MultiSelectStore<T = Record<string, unknown>> {
  state: SelectState<T>;
  actions: {
    addTag: (tag: Tag<T>) => boolean;
    removeTag: (id: string) => void;
    setInputValue: (value: string) => void;
    setHighlight: (index: number) => void;
    toggleDropdown: (open?: boolean) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
    clearInput: () => void;
  };
}

const DEFAULT_CONFIG: MultiSelectConfig = {
  maxSelections: Infinity,
  debounceMs: 300,
  allowCreate: true,
  groupBy: 'category',
  cacheSize: 100,
  delimiter: /[,;\t]/,
  namespace: 'default',
  placeholder: 'Search...',
  disabled: false,
  initialSelected: [],
};

function isDuplicate(selected: Tag[], tag: Tag): boolean {
  return selected.some(
    (t) => t.id === tag.id || t.label.toLowerCase() === tag.label.toLowerCase()
  );
}

export function createMultiSelectStore<T = Record<string, unknown>>(
  config?: Partial<MultiSelectConfig<T>>
) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config } as MultiSelectConfig<T>;

  return create<MultiSelectStore<T>>((set, get) => ({
    state: {
      selected: mergedConfig.initialSelected ?? [],
      inputValue: '',
      isOpen: false,
      highlightedIndex: -1,
      isLoading: false,
      config: mergedConfig,
    },
    actions: {
      addTag: (tag: Tag<T>) => {
        const { selected, config } = get().state;
        if (isDuplicate(selected, tag)) return false;
        if (config.maxSelections && selected.length >= config.maxSelections) return false;
        set((state) => ({
          state: {
            ...state.state,
            selected: [...selected, tag],
            inputValue: '',
            highlightedIndex: -1,
          },
        }));
        return true;
      },
      removeTag: (id: string) => {
        set((state) => ({
          state: {
            ...state.state,
            selected: state.state.selected.filter((t) => t.id !== id),
          },
        }));
      },
      setInputValue: (value: string) => {
        set((state) => ({
          state: {
            ...state.state,
            inputValue: value,
            isOpen: value.length > 0 || state.state.selected.length === 0,
            highlightedIndex: -1,
          },
        }));
      },
      setHighlight: (index: number) => {
        set((state) => ({
          state: { ...state.state, highlightedIndex: index },
        }));
      },
      toggleDropdown: (open?: boolean) => {
        set((state) => ({
          state: {
            ...state.state,
            isOpen: open !== undefined ? open : !state.state.isOpen,
          },
        }));
      },
      setLoading: (loading: boolean) => {
        set((state) => ({
          state: { ...state.state, isLoading: loading },
        }));
      },
      reset: () => {
        const { config } = get().state;
        set({
          state: {
            selected: [],
            inputValue: '',
            isOpen: false,
            highlightedIndex: -1,
            isLoading: false,
            config,
          },
        });
      },
      clearInput: () => {
        set((state) => ({
          state: { ...state.state, inputValue: '', highlightedIndex: -1 },
        }));
      },
    },
  }));
}

// Default store instance
export const useMultiSelectStore = createMultiSelectStore();
