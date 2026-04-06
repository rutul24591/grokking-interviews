// ============================================================
// editor-store.ts — Zustand store for editor state, history
// (undo/redo), selection, and active formats.
// ============================================================

import { create } from "zustand";
import type {
  EditorState,
  DocumentModel,
  SelectionState,
  FormatMark,
  BlockType,
  BlockNode,
} from "./editor-types";

const HISTORY_LIMIT = 100;

function createEmptyDocument(): DocumentModel {
  return {
    root: [
      {
        id: crypto.randomUUID(),
        type: "paragraph",
        children: [{ type: "text", text: "", marks: [] }],
      },
    ],
  };
}

function createInitialSelection(): SelectionState {
  return {
    anchorBlockId: null,
    anchorOffset: 0,
    focusBlockId: null,
    focusOffset: 0,
    isCollapsed: true,
  };
}

function createInitialState(): EditorState {
  const doc = createEmptyDocument();
  return {
    document: doc,
    selection: createInitialSelection(),
    activeFormats: [],
    activeBlockType: "paragraph",
    history: [JSON.parse(JSON.stringify(doc))],
    historyIndex: 0,
    isDirty: false,
  };
}

interface EditorStore extends EditorState {
  // ── Operations ───────────────────────────────────────────
  applyOperation: (updater: (doc: DocumentModel) => DocumentModel) => void;

  // ── History ──────────────────────────────────────────────
  undo: () => void;
  redo: () => void;
  pushHistory: (doc: DocumentModel) => void;

  // ── Selection ────────────────────────────────────────────
  updateSelection: (selection: Partial<SelectionState>) => void;
  setActiveFormats: (formats: FormatMark[]) => void;
  setActiveBlockType: (blockType: BlockType | null) => void;

  // ── Block Manipulation ──────────────────────────────────
  updateBlockType: (blockId: string, type: BlockType, level?: number) => void;
  updateBlockContent: (blockId: string, children: BlockNode["children"]) => void;
  insertBlockAfter: (blockId: string, block: BlockNode) => void;
  removeBlock: (blockId: string) => void;

  // ── Misc ─────────────────────────────────────────────────
  setDirty: (dirty: boolean) => void;
  loadDocument: (doc: DocumentModel) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...createInitialState(),

  pushHistory: (doc: DocumentModel) => {
    const { history, historyIndex } = get();
    // Truncate any redo entries beyond the current index
    const truncated = history.slice(0, historyIndex + 1);
    const snapshot = JSON.parse(JSON.stringify(doc));
    const newHistory = [...truncated, snapshot];

    // Enforce history limit
    if (newHistory.length > HISTORY_LIMIT) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  applyOperation: (updater) => {
    const { document, pushHistory } = get();
    const newDoc = updater(document);
    pushHistory(newDoc);
    set({ document: newDoc });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const doc = JSON.parse(JSON.stringify(history[newIndex]));
    set({
      document: doc,
      historyIndex: newIndex,
      isDirty: true,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const doc = JSON.parse(JSON.stringify(history[newIndex]));
    set({
      document: doc,
      historyIndex: newIndex,
      isDirty: true,
    });
  },

  updateSelection: (selection) => {
    set((state) => ({
      selection: { ...state.selection, ...selection },
    }));
  },

  setActiveFormats: (formats) => {
    set({ activeFormats: formats });
  },

  setActiveBlockType: (blockType) => {
    set({ activeBlockType: blockType });
  },

  updateBlockType: (blockId, type, level) => {
    const { document, pushHistory } = get();
    const newDoc = JSON.parse(JSON.stringify(document));
    const block = findBlock(newDoc.root, blockId);
    if (block) {
      block.type = type;
      if (level !== undefined) block.level = level;
      pushHistory(newDoc);
      set({ document: newDoc, activeBlockType: type });
    }
  },

  updateBlockContent: (blockId, children) => {
    const { document, pushHistory } = get();
    const newDoc = JSON.parse(JSON.stringify(document));
    const block = findBlock(newDoc.root, blockId);
    if (block) {
      block.children = children;
      pushHistory(newDoc);
      set({ document: newDoc });
    }
  },

  insertBlockAfter: (blockId, block) => {
    const { document, pushHistory } = get();
    const newDoc = JSON.parse(JSON.stringify(document));
    const index = findBlockIndex(newDoc.root, blockId);
    if (index !== -1) {
      newDoc.root.splice(index + 1, 0, block);
      pushHistory(newDoc);
      set({ document: newDoc });
    }
  },

  removeBlock: (blockId) => {
    const { document, pushHistory } = get();
    const newDoc = JSON.parse(JSON.stringify(document));
    newDoc.root = newDoc.root.filter((b) => b.id !== blockId);
    if (newDoc.root.length === 0) {
      newDoc.root = createEmptyDocument().root;
    }
    pushHistory(newDoc);
    set({ document: newDoc });
  },

  setDirty: (dirty) => {
    set({ isDirty: dirty });
  },

  loadDocument: (doc) => {
    const snapshot = JSON.parse(JSON.stringify(doc));
    set({
      document: doc,
      history: [snapshot],
      historyIndex: 0,
      isDirty: false,
    });
  },
}));

// ── Helper Functions ──────────────────────────────────────────

function findBlock(
  blocks: BlockNode[],
  blockId: string
): BlockNode | undefined {
  for (const block of blocks) {
    if (block.id === blockId) return block;
  }
  return undefined;
}

function findBlockIndex(blocks: BlockNode[], blockId: string): number {
  return blocks.findIndex((b) => b.id === blockId);
}
