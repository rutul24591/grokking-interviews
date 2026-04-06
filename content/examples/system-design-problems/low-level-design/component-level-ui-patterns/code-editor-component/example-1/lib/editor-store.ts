'use client';
import { create } from 'zustand';
import type { EditorState, EditorConfig } from './editor-types';

interface EditorStore extends EditorState {
  config: EditorConfig;
  isDirty: boolean;
  history: { past: string[]; future: string[] };
  findState: { isOpen: boolean; searchTerm: string; matchIndex: number; matchCount: number };

  // Content mutations
  setContent: (content: string) => void;
  setLanguage: (language: EditorState['language']) => void;
  setCursor: (line: number, col: number) => void;
  setSelections: (selections: EditorState['selections']) => void;

  // Config
  setConfig: (config: Partial<EditorConfig>) => void;

  // Undo / redo
  pushHistory: () => void;
  undo: () => string | null;
  redo: () => string | null;

  // Find / replace
  setFindOpen: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  cycleMatch: (direction: 'next' | 'prev') => void;

  // Dirty tracking
  markClean: () => void;
}

const MAX_HISTORY = 200;

export const useEditorStore = create<EditorStore>((set, get) => ({
  // ─── Initial state ───────────────────────────────────────────────────────
  content: '',
  language: 'javascript',
  cursorLine: 1,
  cursorCol: 0,
  selections: [],
  config: {
    tabSize: 2,
    wordWrap: false,
    showLineNumbers: true,
    showMinimap: true,
  },
  isDirty: false,
  history: { past: [], future: [] },
  findState: { isOpen: false, searchTerm: '', matchIndex: 0, matchCount: 0 },

  // ─── Content ─────────────────────────────────────────────────────────────
  setContent: (content) => {
    get().pushHistory();
    set({ content, isDirty: true });
  },

  setLanguage: (language) => set({ language }),

  setCursor: (cursorLine, cursorCol) => set({ cursorLine, cursorCol }),

  setSelections: (selections) => set({ selections }),

  // ─── Config ──────────────────────────────────────────────────────────────
  setConfig: (partial) =>
    set((s) => ({ config: { ...s.config, ...partial } })),

  // ─── Undo / Redo ─────────────────────────────────────────────────────────
  pushHistory: () => {
    const { content, history } = get();
    if (!content) return;
    const past = [...history.past, content];
    if (past.length > MAX_HISTORY) past.shift();
    set({ history: { past, future: [] } });
  },

  undo: () => {
    const { history, content } = get();
    if (history.past.length === 0) return null;
    const previous = history.past[history.past.length - 1];
    set({
      content: previous,
      history: {
        past: history.past.slice(0, -1),
        future: [content, ...history.future],
      },
    });
    return previous;
  },

  redo: () => {
    const { history, content } = get();
    if (history.future.length === 0) return null;
    const next = history.future[0];
    set({
      content: next,
      history: {
        past: [...history.past, content],
        future: history.future.slice(1),
      },
    });
    return next;
  },

  // ─── Find / Replace ──────────────────────────────────────────────────────
  setFindOpen: (isOpen) => set({ findState: { ...get().findState, isOpen } }),

  setSearchTerm: (searchTerm) => set({ findState: { ...get().findState, searchTerm, matchIndex: 0 } }),

  cycleMatch: (direction) => {
    const { findState } = get();
    const delta = direction === 'next' ? 1 : -1;
    const newIndex = (findState.matchIndex + delta + findState.matchCount) % Math.max(findState.matchCount, 1);
    set({ findState: { ...findState, matchIndex: newIndex } });
  },

  // ─── Dirty ───────────────────────────────────────────────────────────────
  markClean: () => set({ isDirty: false }),
}));
