// ============================================================
// use-toolbar.ts — Toolbar state management, active format
// detection, and action dispatching to the editor store.
// ============================================================

import { useCallback } from "react";
import { useEditorStore } from "../lib/editor-store";
import type { FormatMark, BlockType, ToolbarAction } from "../lib/editor-types";

interface UseToolbarReturn {
  activeFormats: FormatMark[];
  activeBlockType: BlockType | null;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: (action: ToolbarAction) => void;
}

export function useToolbar(): UseToolbarReturn {
  const activeFormats = useEditorStore((s) => s.activeFormats);
  const activeBlockType = useEditorStore((s) => s.activeBlockType);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const dispatch = useCallback(
    (action: ToolbarAction) => {
      switch (action.type) {
        case "TOGGLE_BOLD":
          document.execCommand("bold", false);
          break;
        case "TOGGLE_ITALIC":
          document.execCommand("italic", false);
          break;
        case "TOGGLE_UNDERLINE":
          document.execCommand("underline", false);
          break;
        case "TOGGLE_INLINE_CODE":
          document.execCommand("code", false);
          break;
        case "SET_HEADING":
          if (action.level) {
            document.execCommand("formatBlock", false, `<h${action.level}>`);
          } else {
            document.execCommand("formatBlock", false, "<p>");
          }
          break;
        case "TOGGLE_ORDERED_LIST":
          document.execCommand("insertOrderedList", false);
          break;
        case "TOGGLE_UNORDERED_LIST":
          document.execCommand("insertUnorderedList", false);
          break;
        case "INSERT_LINK": {
          const url = action.url;
          if (url) {
            document.execCommand("createLink", false, url);
          }
          break;
        }
        case "TOGGLE_CODE_BLOCK":
          // Code blocks require custom logic beyond execCommand
          // In production, this would convert the current block to a code block
          // via the document model
          console.log("Toggle code block — requires custom block conversion");
          break;
        case "UNDO":
          document.execCommand("undo", false);
          break;
        case "REDO":
          document.execCommand("redo", false);
          break;
      }

      // After applying the action, sync the document model
      // In production, this triggers a store update
    },
    []
  );

  return {
    activeFormats,
    activeBlockType,
    canUndo,
    canRedo,
    dispatch,
  };
}
