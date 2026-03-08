"use client";

import { AnimatePresence, motion } from "framer-motion";
import { classNames } from "@/lib/classNames";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";

const collapsibleVariants = {
  collapsed: { height: 0, opacity: 0 },
  open: { height: "auto", opacity: 1 },
};

type SidebarItemProps = {
  id: string;
  label: string;
  level: number;
  children?: React.ReactNode;
  isLeaf?: boolean;
  isActive?: boolean;
  onSelect?: (id: string) => void;
};

export function SidebarItem({
  id,
  label,
  level,
  children,
  isLeaf,
  isActive,
  onSelect,
}: SidebarItemProps) {
  const isExpanded = useSidebarStore((state) => state.isExpanded(id));
  const toggleExpanded = useSidebarStore((state) => state.toggleExpanded);

  const paddingLeft = 16 + level * 12;

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => {
          if (isLeaf) {
            onSelect?.(id);
            return;
          }
          const wasExpanded = isExpanded;
          toggleExpanded(id);
          // Navigate when expanding (not collapsing)
          if (!wasExpanded) {
            onSelect?.(id);
          }
        }}
        className={classNames(
          "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
          "hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          isLeaf ? "text-theme" : "text-heading",
          isActive ? "bg-panel-hover text-heading" : ""
        )}
        style={{ paddingLeft }}
        role="treeitem"
        aria-expanded={isLeaf ? undefined : isExpanded}
        aria-level={level}
        aria-selected={Boolean(isActive)}
      >
        <span className="truncate">{label}</span>
        {!isLeaf && (
          <span
            className={classNames(
              "ml-3 text-xs uppercase tracking-[0.2em] text-muted transition",
              isExpanded ? "rotate-90" : "rotate-0"
            )}
            aria-hidden
          >
            ›
          </span>
        )}
      </button>
      {!isLeaf && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={collapsibleVariants}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
