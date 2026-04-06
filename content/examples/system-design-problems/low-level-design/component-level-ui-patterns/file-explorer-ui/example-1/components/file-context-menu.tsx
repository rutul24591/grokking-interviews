"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FileItem } from "../lib/explorer-types";

interface FileContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  targetItem: FileItem | null;
  onClose: () => void;
  onOpen: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onMove: (item: FileItem) => void;
  onCopy: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onProperties: (item: FileItem) => void;
}

interface MenuItemDef {
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export function FileContextMenu({
  isOpen,
  x,
  y,
  targetItem,
  onClose,
  onOpen,
  onRename,
  onDelete,
  onMove,
  onCopy,
  onDownload,
  onProperties,
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  // Viewport-aware positioning
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 8;
    }
    if (y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 8;
    }

    setPosition({ x: Math.max(8, adjustedX), y: Math.max(8, adjustedY) });
  }, [isOpen, x, y]);

  // Outside click and Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMenuAction = useCallback(
    (action: () => void) => {
      action();
      onClose();
    },
    [onClose]
  );

  const menuItems: MenuItemDef[] = targetItem
    ? [
        { label: "Open", icon: "M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z", action: () => onOpen(targetItem) },
        { label: "Rename", icon: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.001 1.001 0 0 0 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z", action: () => onRename(targetItem) },
        { label: "Delete", icon: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z", action: () => onDelete(targetItem), divider: true },
        { label: "Move to", icon: "M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5z", action: () => onMove(targetItem) },
        { label: "Copy to", icon: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z", action: () => onCopy(targetItem) },
        { label: "Download", icon: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", action: () => onDownload(targetItem) },
        { label: "Properties", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z", action: () => onProperties(targetItem) },
      ]
    : [];

  if (!isOpen || !targetItem) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      {menuItems.map((item, index) => (
        <div key={item.label}>
          <button
            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
              item.disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={() => handleMenuAction(item.action)}
            disabled={item.disabled}
            role="menuitem"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
          {item.divider && (
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
}
