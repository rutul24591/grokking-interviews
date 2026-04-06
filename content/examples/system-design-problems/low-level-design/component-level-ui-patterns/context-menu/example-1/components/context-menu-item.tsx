'use client';

import React from 'react';
import type { ActionMenuItem, SubmenuMenuItem } from '../lib/context-menu-types';

interface ContextMenuItemProps {
  item: ActionMenuItem | SubmenuMenuItem;
  isFocused: boolean;
  index: number;
}

export function ContextMenuItem({ item, isFocused, index }: ContextMenuItemProps) {
  const isSubmenu = item.type === 'submenu';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'item' && !item.disabled && item.onSelect) {
      item.onSelect();
    }
  };

  const handleMouseEnter = () => {
    // Sub-menus are handled by the submenu component
  };

  if (item.type === 'item' && item.disabled) {
    return (
      <div
        role="menuitem"
        aria-disabled="true"
        title={item.disabledReason || 'This action is currently unavailable'}
        data-focused-menu-item={isFocused ? 'true' : 'false'}
        tabIndex={-1}
        className="flex w-full cursor-not-allowed items-center justify-between rounded px-3 py-1.5 text-sm text-muted-foreground opacity-50"
      >
        <div className="flex items-center gap-2">
          {item.icon && (
            <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </div>
        {item.shortcut && (
          <span className="text-xs text-muted-foreground">{item.shortcut}</span>
        )}
      </div>
    );
  }

  if (item.type === 'item') {
    return (
      <button
        role="menuitem"
        data-focused-menu-item={isFocused ? 'true' : 'false'}
        tabIndex={-1}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`
          flex w-full items-center justify-between rounded px-3 py-1.5 text-sm
          transition-colors outline-none
          ${
            isFocused
              ? 'bg-accent/20 text-accent'
              : 'hover:bg-panel-hover'
          }
        `}
      >
        <div className="flex items-center gap-2">
          {item.icon && (
            <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>
          )}
          <span>{item.label}</span>
        </div>
        {item.shortcut && (
          <span className="text-xs text-muted-foreground">{item.shortcut}</span>
        )}
      </button>
    );
  }

  // Submenu item
  return (
    <div
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded="false"
      data-focused-menu-item={isFocused ? 'true' : 'false'}
      tabIndex={-1}
      className={`
        flex w-full cursor-pointer items-center justify-between rounded px-3 py-1.5 text-sm
        transition-colors outline-none
        ${
          isFocused
            ? 'bg-accent/20 text-accent'
            : 'hover:bg-panel-hover'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span>
        )}
        <span>{item.label}</span>
      </div>
      {/* Sub-menu indicator arrow */}
      <svg
        className="h-3 w-3 text-muted-foreground"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 2l4 4-4 4" />
      </svg>
    </div>
  );
}
