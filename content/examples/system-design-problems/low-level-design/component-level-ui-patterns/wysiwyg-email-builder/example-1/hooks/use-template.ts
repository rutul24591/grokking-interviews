'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import type { Block, BlockType, Template } from '../lib/email-types';

const STORAGE_KEY_PREFIX = 'email-template-';

interface UseTemplateOptions {
  templateId?: string;
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  maxUndoSteps?: number;
}

interface UseTemplateReturn {
  blocks: Block[];
  selectedBlockId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  addBlock: (type: BlockType, config?: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, config: Partial<Record<string, unknown>>) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  duplicateBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  save: () => void;
  load: (template: Template) => void;
  loadFromStorage: () => void;
  reset: () => void;
  exportTemplate: () => Template;
}

/**
 * Main builder hook for email template management.
 * Handles block CRUD, undo/redo stack, and save/load with localStorage persistence.
 */
export function useTemplate({
  templateId,
  initialBlocks = [],
  onSave,
  maxUndoSteps = 50,
}: UseTemplateOptions = {}): UseTemplateReturn {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Undo/redo stacks store snapshots of the blocks array
  const [undoStack, setUndoStack] = useState<Block[][]>([]);
  const [redoStack, setRedoStack] = useState<Block[][]>([]);

  const blocksRef = useRef(blocks);
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  /**
   * Push current state to undo stack before making changes.
   */
  const pushUndo = useCallback(
    (currentBlocks: Block[]) => {
      setUndoStack((prev) => {
        const next = [...prev, JSON.parse(JSON.stringify(currentBlocks))];
        return next.slice(-maxUndoSteps);
      });
      // Clear redo stack when a new action is performed
      setRedoStack([]);
    },
    [maxUndoSteps]
  );

  const generateId = useCallback(() => {
    return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  const getDefaultConfig = useCallback((type: BlockType): Record<string, unknown> => {
    switch (type) {
      case 'text':
        return { content: 'Edit this text', fontSize: 14, color: '#333333' };
      case 'image':
        return { src: '', alt: 'Image', width: '100%' };
      case 'button':
        return { label: 'Click Here', url: '#', bgColor: '#3b82f6', textColor: '#ffffff', borderRadius: 4 };
      case 'divider':
        return { color: '#e5e7eb', thickness: 1 };
      case 'spacer':
        return { height: 16 };
      default:
        return {};
    }
  }, []);

  const addBlock = useCallback(
    (type: BlockType, config?: Record<string, unknown>) => {
      pushUndo(blocksRef.current);
      const newBlock: Block = {
        id: generateId(),
        type,
        config: config ?? getDefaultConfig(type),
      };
      setBlocks((prev) => [...prev, newBlock]);
      setSelectedBlockId(newBlock.id);
    },
    [generateId, getDefaultConfig, pushUndo]
  );

  const removeBlock = useCallback(
    (id: string) => {
      pushUndo(blocksRef.current);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      if (selectedBlockId === id) setSelectedBlockId(null);
    },
    [selectedBlockId, pushUndo]
  );

  const updateBlock = useCallback(
    (id: string, config: Partial<Record<string, unknown>>) => {
      pushUndo(blocksRef.current);
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, config: { ...b.config, ...config } } : b))
      );
    },
    [pushUndo]
  );

  const moveBlock = useCallback(
    (id: string, direction: 'up' | 'down') => {
      pushUndo(blocksRef.current);
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index < 0) return prev;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;
        const next = [...prev];
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        return next;
      });
    },
    [pushUndo]
  );

  const duplicateBlock = useCallback(
    (id: string) => {
      pushUndo(blocksRef.current);
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index < 0) return prev;
        const original = prev[index];
        const duplicate: Block = {
          id: generateId(),
          type: original.type,
          config: { ...original.config },
        };
        const next = [...prev];
        next.splice(index + 1, 0, duplicate);
        return next;
      });
    },
    [generateId, pushUndo]
  );

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const undo = useCallback(() => {
    setUndoStack((prev) => {
      if (prev.length === 0) return prev;
      const lastState = prev[prev.length - 1];
      setRedoStack((redo) => [...redo, JSON.parse(JSON.stringify(blocksRef.current))]);
      setBlocks(lastState);
      blocksRef.current = lastState;
      return prev.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const nextState = prev[prev.length - 1];
      setUndoStack((undo) => [...undo, JSON.parse(JSON.stringify(blocksRef.current))]);
      setBlocks(nextState);
      blocksRef.current = nextState;
      return prev.slice(0, -1);
    });
  }, []);

  const save = useCallback(() => {
    onSave?.(blocksRef.current);
    // Also persist to localStorage
    if (templateId && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${templateId}`,
          JSON.stringify(blocksRef.current)
        );
      } catch {
        // Storage unavailable
      }
    }
  }, [templateId, onSave]);

  const load = useCallback((template: Template) => {
    setBlocks(template.blocks);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedBlockId(null);
  }, []);

  const loadFromStorage = useCallback(() => {
    if (!templateId || typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${templateId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as Block[];
        if (Array.isArray(parsed)) {
          setBlocks(parsed);
          setUndoStack([]);
          setRedoStack([]);
        }
      }
    } catch {
      // Malformed storage data
    }
  }, [templateId]);

  const reset = useCallback(() => {
    setBlocks([]);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedBlockId(null);
    if (templateId && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${templateId}`);
      } catch {
        // Ignore
      }
    }
  }, [templateId]);

  const exportTemplate = useCallback((): Template => {
    return {
      id: templateId ?? `template-${Date.now()}`,
      name: templateId ?? 'Untitled Template',
      blocks: JSON.parse(JSON.stringify(blocksRef.current)),
    };
  }, [templateId]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (isMod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    blocks,
    selectedBlockId,
    canUndo,
    canRedo,
    addBlock,
    removeBlock,
    updateBlock,
    moveBlock,
    duplicateBlock,
    selectBlock,
    undo,
    redo,
    save,
    load,
    loadFromStorage,
    reset,
    exportTemplate,
  };
}
