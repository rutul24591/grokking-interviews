// ============================================================
// mention-dropdown.tsx — @mention autocomplete dropdown with
// keyboard navigation (arrow keys, Enter, Escape), positioned
// relative to the cursor.
// ============================================================

"use client";

import React, { useEffect, useRef } from "react";
import type { MentionData } from "../lib/editor-types";

interface MentionDropdownProps {
  results: MentionData[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (userId: string) => void;
  onKeyDown: (key: string) => void;
  className?: string;
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  results,
  selectedIndex,
  position,
  onSelect,
  onKeyDown,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        event.stopPropagation();
        onKeyDown(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handleKeyDown, true);
  }, [onKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectedItem = container.querySelector(
      `[data-mention-index="${selectedIndex}"]`
    ) as HTMLElement | null;

    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (results.length === 0) return null;

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Mention suggestions"
      className={`absolute z-50 max-h-60 w-72 overflow-y-auto rounded-lg border border-theme bg-panel-soft shadow-lg ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {results.map((user, index) => (
        <button
          key={user.id}
          role="option"
          aria-selected={index === selectedIndex}
          data-mention-index={index}
          className={`
            flex w-full items-center gap-3 px-3 py-2 text-left text-sm
            transition-colors duration-100 focus:outline-none
            ${
              index === selectedIndex
                ? "bg-accent/10 text-accent dark:bg-accent/20"
                : "text-foreground hover:bg-panel"
            }
          `}
          onClick={() => onSelect(user.id)}
          onMouseEnter={() => {
            // Update selected index on hover (optional UX improvement)
          }}
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-xs">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              user.displayName.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{user.displayName}</div>
            <div className="truncate text-xs text-muted">@{user.username}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MentionDropdown;
