import { create } from 'zustand';
import type { Command, CommandPaletteState, CommandResult } from './command-palette-types';

type Actions = {
  open: (triggerEl?: HTMLElement | null) => void;
  close: () => void;
  setQuery: (q: string) => void;
  setResults: (results: CommandResult[]) => void;
  setHighlight: (idx: number) => void;
  executeCommand: (cmd: Command) => void;
  addToRecent: (cmd: Command) => void;
  setLoading: (loading: boolean) => void;
};

export const useCommandPaletteStore = create<CommandPaletteState & Actions>((set, get) => ({
  isOpen: false,
  query: '',
  highlightIndex: 0,
  results: [],
  isLoading: false,
  recentCommands: [],
  open: () => set({ isOpen: true, query: '', highlightIndex: 0 }),
  close: () => set({ isOpen: false, query: '', highlightIndex: 0, results: [] }),
  setQuery: (q) => set({ query: q, highlightIndex: 0 }),
  setResults: (results) => set({ results, highlightIndex: 0 }),
  setHighlight: (idx) => set({ highlightIndex: Math.max(0, Math.min(idx, get().results.length - 1)) }),
  executeCommand: (cmd) => {
    cmd.execute(cmd.payload);
    get().addToRecent(cmd);
    get().close();
  },
  addToRecent: (cmd) => {
    const recent = get().recentCommands.filter((r) => r.id !== cmd.id);
    set({ recentCommands: [cmd, ...recent].slice(0, 10) });
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
