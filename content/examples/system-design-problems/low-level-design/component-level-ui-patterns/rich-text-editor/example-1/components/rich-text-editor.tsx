// ============================================================
// rich-text-editor.tsx — Root editor component with contentEditable
// div, selection tracking, and child component rendering.
// ============================================================

"use client";

import React from "react";
import { useEditor } from "../hooks/use-editor";
import { MentionDropdown } from "./mention-dropdown";
import type { MentionData } from "../lib/editor-types";

interface RichTextEditorProps {
  mentionableUsers: MentionData[];
  uploadEndpoint: string;
  initialContent?: string;
  collaborative?: boolean;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  mentionableUsers,
  uploadEndpoint,
  initialContent,
  collaborative = false,
  className = "",
}) => {
  const {
    editorRef,
    isMounted,
    mentionState,
    handleInput,
    handleKeyDown,
    handleSelect,
    handleDrop,
    handlePaste,
    handleMentionSelect,
    handleMentionKeyDown,
  } = useEditor({
    mentionableUsers,
    uploadEndpoint,
    collaborative,
  });

  // SSR-safe: render placeholder during server rendering
  if (!isMounted) {
    return (
      <div
        className={`min-h-[200px] rounded-lg border border-theme bg-panel-soft p-4 text-muted ${className}`}
      >
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        className={
          "min-h-[300px] rounded-lg border border-theme bg-background p-4 " +
          "prose prose-sm max-w-none outline-none focus:ring-2 " +
          "focus:ring-accent/50 dark:prose-invert " +
          "[&_.mention]:inline-flex [&_.mention]:items-center [&_.mention]:px-1.5 " +
          "[&_.mention]:py-0.5 [&_.mention]:rounded [&_.mention]:bg-accent/20 " +
          "[&_.mention]:text-accent [&_.mention]:text-sm [&_.mention]:font-medium"
        }
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onDrop={handleDrop}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={
          initialContent ? { __html: initialContent } : undefined
        }
      />

      {/* Mention Dropdown */}
      {mentionState.isOpen && mentionState.position && (
        <MentionDropdown
          results={mentionState.results}
          selectedIndex={mentionState.selectedIndex}
          position={mentionState.position}
          onSelect={handleMentionSelect}
          onKeyDown={handleMentionKeyDown}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
