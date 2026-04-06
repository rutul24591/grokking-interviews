// ============================================================
// use-editor.ts — Core editor hook that wires together the
// contentEditable div, Zustand store, mention engine, and image
// handler. Manages input, selection, formatting, and image
// drop/paste handling.
// ============================================================

import { useRef, useCallback, useEffect, useState } from "react";
import { useEditorStore } from "../lib/editor-store";
import {
  updateMentionState,
  handleMentionKeyDown as handleMentionKeyNav,
} from "../lib/mention-engine";
import {
  extractImagesFromDrop,
  extractImagesFromPaste,
  createImageData,
  uploadImage,
  UploadCallbacks,
} from "../lib/image-handler";
import type { MentionState, MentionData, ImageData } from "../lib/editor-types";

interface UseEditorOptions {
  mentionableUsers: MentionData[];
  uploadEndpoint: string;
  collaborative?: boolean;
}

interface UseEditorReturn {
  editorRef: React.RefObject<HTMLDivElement | null>;
  isMounted: boolean;
  mentionState: MentionState;
  images: Map<string, ImageData>;
  handleInput: (event: React.FormEvent<HTMLDivElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleSelect: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  handleMentionSelect: (userId: string) => void;
  handleMentionKeyDown: (key: string) => void;
}

export function useEditor({
  mentionableUsers,
  uploadEndpoint,
  collaborative = false,
}: UseEditorOptions): UseEditorReturn {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mentionState, setMentionState] = useState<MentionState>({
    query: "",
    results: [],
    selectedIndex: 0,
    position: null,
    isOpen: false,
  });
  const [images, setImages] = useState<Map<string, ImageData>>(new Map());

  const uploadControllers = useRef<Map<string, AbortController>>(new Map());

  const updateSelection = useEditorStore((s) => s.updateSelection);
  const setActiveFormats = useEditorStore((s) => s.setActiveFormats);
  const setActiveBlockType = useEditorStore((s) => s.setActiveBlockType);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  // SSR-safe mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Input Handler ─────────────────────────────────────────

  const handleInput = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (!editorRef.current) return;

      const editorEl = editorRef.current;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Get text content before cursor for mention detection
      const textNode = range.startContainer;
      if (textNode.nodeType !== Node.TEXT_NODE) return;

      const textBeforeCursor = textNode.textContent?.slice(
        0,
        range.startOffset
      );

      if (textBeforeCursor === undefined) return;

      // Update mention state
      const newMentionState = updateMentionState(
        textBeforeCursor,
        mentionableUsers,
        editorEl,
        mentionState
      );
      setMentionState(newMentionState);

      // Sync document model (debounced in production)
      syncDocumentModel();
    },
    [mentionableUsers, mentionState]
  );

  // ── Key Down Handler ──────────────────────────────────────

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Handle mention dropdown navigation
      if (mentionState.isOpen) {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Escape" ||
          event.key === "Enter"
        ) {
          event.preventDefault();

          if (event.key === "Enter" && mentionState.selectedIndex >= 0) {
            const selected = mentionState.results[mentionState.selectedIndex];
            if (selected) {
              handleMentionSelect(selected.id);
            }
          } else {
            const updated = handleMentionKeyNav(mentionState, event.key);
            setMentionState(updated);
          }
          return;
        }
      }

      // Undo/Redo
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
    },
    [mentionState, undo, redo]
  );

  // ── Selection Change Handler ──────────────────────────────

  const handleSelect = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Detect active formats by walking up the DOM tree
    const formats: string[] = [];
    let node: Node | null = range.startContainer;
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement) {
        if (node.tagName === "STRONG" || node.tagName === "B")
          formats.push("bold");
        if (node.tagName === "EM" || node.tagName === "I")
          formats.push("italic");
        if (node.tagName === "U") formats.push("underline");
        if (node.tagName === "CODE") formats.push("code");
      }
      node = node.parentNode;
    }

    setActiveFormats(formats as any);

    // Detect active block type
    let blockNode: Node | null = range.startContainer;
    while (blockNode && blockNode !== editorRef.current) {
      if (blockNode instanceof HTMLElement) {
        const tag = blockNode.tagName.toLowerCase();
        if (tag === "p") setActiveBlockType("paragraph");
        else if (tag.startsWith("h"))
          setActiveBlockType("heading");
        else if (tag === "li") setActiveBlockType("list-item");
        else if (tag === "pre") setActiveBlockType("code-block");
      }
      blockNode = blockNode.parentNode;
    }

    updateSelection({
      isCollapsed: selection.isCollapsed,
    });
  }, [updateSelection, setActiveFormats, setActiveBlockType]);

  // ── Drop Handler ──────────────────────────────────────────

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = extractImagesFromDrop(event.nativeEvent);

      for (const file of files) {
        const blockId = crypto.randomUUID();
        const imageData = createImageData(file, blockId);
        setImages((prev) => new Map(prev).set(imageData.id, imageData));

        const callbacks: UploadCallbacks = {
          onProgress: (id, progress) => {
            setImages((prev) => {
              const next = new Map(prev);
              const img = next.get(id);
              if (img) {
                next.set(id, { ...img, status: "uploading", progress });
              }
              return next;
            });
          },
          onComplete: (id, url) => {
            setImages((prev) => {
              const next = new Map(prev);
              const img = next.get(id);
              if (img) {
                next.set(id, { ...img, status: "complete", url, progress: 100 });
              }
              return next;
            });
          },
          onError: (id, error) => {
            setImages((prev) => {
              const next = new Map(prev);
              const img = next.get(id);
              if (img) {
                next.set(id, { ...img, status: "failed", error });
              }
              return next;
            });
          },
        };

        const controller = uploadImage(imageData, uploadEndpoint, callbacks);
        uploadControllers.current.set(imageData.id, controller);
      }
    },
    [uploadEndpoint]
  );

  // ── Paste Handler ─────────────────────────────────────────

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const imageFiles = extractImagesFromPaste(event.nativeEvent);

      if (imageFiles.length > 0) {
        event.preventDefault(); // Prevent default paste for images

        for (const file of imageFiles) {
          const blockId = crypto.randomUUID();
          const imageData = createImageData(file, blockId);
          setImages((prev) => new Map(prev).set(imageData.id, imageData));

          const callbacks: UploadCallbacks = {
            onProgress: (id, progress) => {
              setImages((prev) => {
                const next = new Map(prev);
                const img = next.get(id);
                if (img) {
                  next.set(id, { ...img, status: "uploading", progress });
                }
                return next;
              });
            },
            onComplete: (id, url) => {
              setImages((prev) => {
                const next = new Map(prev);
                const img = next.get(id);
                if (img) {
                  next.set(id, {
                    ...img,
                    status: "complete",
                    url,
                    progress: 100,
                  });
                }
                return next;
              });
            },
            onError: (id, error) => {
              setImages((prev) => {
                const next = new Map(prev);
                const img = next.get(id);
                if (img) {
                  next.set(id, { ...img, status: "failed", error });
                }
                return next;
              });
            },
          };

          const controller = uploadImage(imageData, uploadEndpoint, callbacks);
          uploadControllers.current.set(imageData.id, controller);
        }
      }
      // If no image files, let the default paste behavior handle text/HTML
    },
    [uploadEndpoint]
  );

  // ── Mention Select ────────────────────────────────────────

  const handleMentionSelect = useCallback(
    (userId: string) => {
      const user = mentionableUsers.find((u) => u.id === userId);
      if (!user) return;

      // Insert mention at cursor position
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Delete the @query text
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent ?? "";
        const mentionStart = text.lastIndexOf(
          "@",
          range.startOffset
        );
        if (mentionStart !== -1) {
          const beforeMention = text.slice(0, mentionStart);
          const afterMention = text.slice(range.startOffset);
          textNode.textContent = beforeMention + afterMention;

          // Insert mention span
          const mentionSpan = document.createElement("span");
          mentionSpan.setAttribute("data-mention", user.id);
          mentionSpan.setAttribute("contenteditable", "false");
          mentionSpan.textContent = `@${user.displayName}`;
          mentionSpan.className =
            "inline-flex items-center px-1.5 py-0.5 rounded bg-accent/20 text-accent text-sm font-medium";

          const newRange = document.createRange();
          newRange.setStart(textNode, mentionStart);
          newRange.setEnd(textNode, mentionStart);
          newRange.insertNode(mentionSpan);

          // Move cursor after mention
          newRange.setStartAfter(mentionSpan);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }

      // Close dropdown
      setMentionState({
        query: "",
        results: [],
        selectedIndex: 0,
        position: null,
        isOpen: false,
      });

      syncDocumentModel();
    },
    [mentionableUsers]
  );

  const handleMentionKeyDownNav = useCallback(
    (key: string) => {
      const updated = handleMentionKeyNav(mentionState, key);

      if (key === "Enter" && updated.selectedIndex >= 0) {
        const selected = updated.results[updated.selectedIndex];
        if (selected) {
          handleMentionSelect(selected.id);
          return;
        }
      }

      setMentionState(updated);
    },
    [mentionState, handleMentionSelect]
  );

  return {
    editorRef,
    isMounted,
    mentionState,
    images,
    handleInput,
    handleKeyDown,
    handleSelect,
    handleDrop,
    handlePaste,
    handleMentionSelect,
    handleMentionKeyDown: handleMentionKeyDownNav,
  };
}

// ── Document Model Sync (stub — in production, debounced) ──

function syncDocumentModel() {
  // In production, this would:
  // 1. Read the current contentEditable DOM
  // 2. Convert it to the internal DocumentModel
  // 3. Update the Zustand store
  // This is debounced at 150ms to avoid excessive updates during typing.
}
