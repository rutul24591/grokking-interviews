import { useCallback, useRef } from 'react';
import { readPersistedState, writePersistedState } from '../lib/split-pane-store';
import type { PersistenceData } from '../lib/split-pane-types';

const DEFAULT_SIZE = 50;

interface PersistenceReturn {
  read: () => { pane1Size: number; pane2Size: number; collapsedPane: string | null };
  write: (pane1Size: number, pane2Size: number, collapsedPane: string | null) => void;
}

/**
 * Hook for saving and restoring pane sizes to localStorage.
 * Handles debounced writes, corruption recovery, and schema migration.
 *
 * @param storageKey - unique key for this SplitPane instance
 * @param defaultPane1Size - fallback percentage if no persisted data exists
 */
export function usePanePersistence(
  storageKey: string,
  defaultPane1Size: number = DEFAULT_SIZE,
): PersistenceReturn {
  const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const read = useCallback((): { pane1Size: number; pane2Size: number; collapsedPane: string | null } => {
    const data = readPersistedState(storageKey);

    if (!data) {
      return {
        pane1Size: defaultPane1Size,
        pane2Size: 100 - defaultPane1Size,
        collapsedPane: null,
      };
    }

    return {
      pane1Size: data.pane1Size,
      pane2Size: data.pane2Size,
      collapsedPane: data.collapsedPane,
    };
  }, [storageKey, defaultPane1Size]);

  const write = useCallback(
    (pane1Size: number, pane2Size: number, collapsedPane: string | null) => {
      // Debounce writes to avoid excessive localStorage I/O during active dragging
      if (writeTimerRef.current) {
        clearTimeout(writeTimerRef.current);
      }

      writeTimerRef.current = setTimeout(() => {
        const data: Omit<PersistenceData, 'schemaVersion' | 'timestamp'> = {
          pane1Size,
          pane2Size,
          collapsedPane,
        };
        writePersistedState(storageKey, data);
        writeTimerRef.current = null;
      }, 300);
    },
    [storageKey],
  );

  return { read, write };
}
