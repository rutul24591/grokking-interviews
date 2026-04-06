// ============================================================
// toolbar.tsx — Formatting toolbar with active state indicators
// for bold, italic, underline, headings, lists, links, code,
// undo, and redo.
// ============================================================

"use client";

import React from "react";
import { useToolbar } from "../hooks/use-toolbar";
import type { ToolbarAction } from "../lib/editor-types";

interface ToolbarButtonProps {
  label: string;
  ariaLabel: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  ariaLabel,
  isActive = false,
  isDisabled = false,
  onClick,
  children,
}) => (
  <button
    type="button"
    title={label}
    aria-label={ariaLabel}
    aria-pressed={isActive}
    disabled={isDisabled}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center rounded-md p-2 text-sm font-medium
      transition-colors duration-150 focus:outline-none focus:ring-2
      focus:ring-accent/50 disabled:opacity-40 disabled:cursor-not-allowed
      ${
        isActive
          ? "bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent-light"
          : "text-foreground hover:bg-panel-soft dark:hover:bg-panel"
      }
    `}
  >
    {children}
  </button>
);

// ── SVG Icons ───────────────────────────────────────────────

const BoldIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 2h5a3 3 0 0 1 2.1 5.15A3.5 3.5 0 0 1 9.5 14H4V2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 8h4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ItalicIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M10 2H6M10 14H6M9 2L7 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const UnderlineIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 2v6a4 4 0 0 0 8 0V2M3 14h10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CodeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5.5 4L1.5 8l4 4M10.5 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OrderedListIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 3h8M6 8h8M6 13h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 3h1M2 8h1l-1 1M2.5 12v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const UnorderedListIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 3h8M6 8h8M6 13h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="2.5" cy="3" r="1" fill="currentColor" />
    <circle cx="2.5" cy="8" r="1" fill="currentColor" />
    <circle cx="2.5" cy="13" r="1" fill="currentColor" />
  </svg>
);

const UndoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 5h7a4 4 0 0 1 0 8H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 2L3 5l3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RedoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M13 5H6a4 4 0 0 0 0 8h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 2l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Toolbar Component ───────────────────────────────────────

interface ToolbarProps {
  onInsertLink?: () => void;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onInsertLink,
  className = "",
}) => {
  const { activeFormats, activeBlockType, canUndo, canRedo, dispatch } =
    useToolbar();

  const handleDispatch = (action: ToolbarAction) => {
    if (action.type === "INSERT_LINK" && onInsertLink) {
      onInsertLink();
    } else {
      dispatch(action);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Text formatting toolbar"
      className={`flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-theme bg-panel-soft px-2 py-1.5 ${className}`}
    >
      {/* Text Formatting */}
      <ToolbarButton
        label="Bold"
        ariaLabel="Toggle bold formatting"
        isActive={activeFormats.includes("bold")}
        onClick={() => handleDispatch({ type: "TOGGLE_BOLD" })}
      >
        <BoldIcon />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        ariaLabel="Toggle italic formatting"
        isActive={activeFormats.includes("italic")}
        onClick={() => handleDispatch({ type: "TOGGLE_ITALIC" })}
      >
        <ItalicIcon />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        ariaLabel="Toggle underline formatting"
        isActive={activeFormats.includes("underline")}
        onClick={() => handleDispatch({ type: "TOGGLE_UNDERLINE" })}
      >
        <UnderlineIcon />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-theme" aria-hidden="true" />

      {/* Headings */}
      {[1, 2, 3, 4].map((level) => (
        <ToolbarButton
          key={level}
          label={`Heading ${level}`}
          ariaLabel={`Apply heading ${level}`}
          isActive={activeBlockType === "heading"}
          onClick={() =>
            handleDispatch({ type: "SET_HEADING", level })
          }
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolbarButton>
      ))}

      <div className="mx-1 h-5 w-px bg-theme" aria-hidden="true" />

      {/* Lists */}
      <ToolbarButton
        label="Ordered List"
        ariaLabel="Toggle ordered list"
        onClick={() => handleDispatch({ type: "TOGGLE_ORDERED_LIST" })}
      >
        <OrderedListIcon />
      </ToolbarButton>

      <ToolbarButton
        label="Unordered List"
        ariaLabel="Toggle unordered list"
        onClick={() => handleDispatch({ type: "TOGGLE_UNORDERED_LIST" })}
      >
        <UnorderedListIcon />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-theme" aria-hidden="true" />

      {/* Link & Code */}
      <ToolbarButton
        label="Insert Link"
        ariaLabel="Insert link"
        onClick={() => handleDispatch({ type: "INSERT_LINK", url: "" })}
      >
        <LinkIcon />
      </ToolbarButton>

      <ToolbarButton
        label="Inline Code"
        ariaLabel="Toggle inline code"
        isActive={activeFormats.includes("code")}
        onClick={() => handleDispatch({ type: "TOGGLE_INLINE_CODE" })}
      >
        <CodeIcon />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-theme" aria-hidden="true" />

      {/* Undo / Redo */}
      <ToolbarButton
        label="Undo"
        ariaLabel="Undo"
        isDisabled={!canUndo}
        onClick={() => handleDispatch({ type: "UNDO" })}
      >
        <UndoIcon />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        ariaLabel="Redo"
        isDisabled={!canRedo}
        onClick={() => handleDispatch({ type: "REDO" })}
      >
        <RedoIcon />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
