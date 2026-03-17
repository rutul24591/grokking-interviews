"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/classNames";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { useSidebarContext } from "@/features/sidebar/SidebarContext";
import type { Category, Subcategory } from "@/features/sidebar/sidebar.store";

type SidebarItemProps = {
  id: string;
  name: string;
  slug: string;
  level: "domain" | "category" | "subcategory";
  children?: React.ReactNode;
  hasChildren?: boolean;
};

export function SidebarItem({
  id,
  name,
  slug,
  level,
  children,
  hasChildren = false,
}: SidebarItemProps) {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { focusedItemId, setFocusedItemId } = useSidebarContext();

  const {
    expandedDomains,
    expandedCategories,
    expandedSubcategories,
    toggleDomain,
    toggleCategory,
    toggleSubcategory,
  } = useSidebarStore();

  const isExpanded =
    level === "domain"
      ? expandedDomains.includes(id)
      : level === "category"
        ? expandedCategories.includes(id)
        : level === "subcategory"
          ? expandedSubcategories.includes(id)
          : false;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      if (level === "domain") toggleDomain(id);
      else if (level === "category") toggleCategory(id);
      else if (level === "subcategory") toggleSubcategory(id);
    }
    setFocusedItemId(id);
  }, [
    hasChildren,
    id,
    level,
    toggleDomain,
    toggleCategory,
    toggleSubcategory,
    setFocusedItemId,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  useEffect(() => {
    if (focusedItemId === id && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [focusedItemId, id]);

  const indentStyles = {
    domain: "pl-2",
    category: "pl-4",
    subcategory: "pl-6",
  };

  const sizeStyles = {
    domain: "text-sm font-semibold",
    category: "text-sm font-medium",
    subcategory: "text-sm",
  };

  // Subcategory level - render as Link to subcategory page
  if (level === "subcategory") {
    const isActive = pathname?.includes(slug);
    return (
      <Link
        href={`/articles/${slug}`}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        className={classNames(
          "block cursor-pointer rounded-lg px-3 py-2 transition",
          indentStyles[level],
          sizeStyles[level],
          isActive
            ? "bg-accent text-white font-semibold"
            : "text-muted hover:text-accent hover:bg-accent-light",
        )}
        onFocus={() => setFocusedItemId(id)}
        role="treeitem"
        aria-current={isActive ? "page" : undefined}
      >
        {name}
      </Link>
    );
  }

  // Domain and Category levels - expandable buttons
  return (
    <div className="select-none">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={classNames(
          "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left transition",
          indentStyles[level],
          sizeStyles[level],
          "text-muted hover:text-accent hover:bg-accent-light",
        )}
        onFocus={() => setFocusedItemId(id)}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-label={name}
      >
        {hasChildren && (
          <motion.span
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block h-5 w-3 text-accent"
            aria-hidden="true"
          >
            ▶
          </motion.span>
        )}
        {!hasChildren && <span className="h-3 w-3" aria-hidden="true" />}
        <span className="flex-1">{name}</span>
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden pl-6"
            role="group"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type CategoryItemProps = {
  category: Category;
  domainSlug: string;
};

export function CategoryItem({ category, domainSlug }: CategoryItemProps) {
  const slug = `${domainSlug}/${category.slug}`;

  return (
    <SidebarItem
      id={category.id}
      name={category.name}
      slug={slug}
      level="category"
      hasChildren={category.subcategories.length > 0}
    >
      {category.subcategories.map((subcategory) => (
        <SubcategoryItem
          key={subcategory.id}
          subcategory={subcategory}
          categorySlug={slug}
        />
      ))}
    </SidebarItem>
  );
}

type SubcategoryItemProps = {
  subcategory: Subcategory;
  categorySlug: string;
};

export function SubcategoryItem({
  subcategory,
  categorySlug,
}: SubcategoryItemProps) {
  const slug = `${categorySlug}/${subcategory.slug}`;

  return (
    <SidebarItem
      id={subcategory.id}
      name={subcategory.name}
      slug={slug}
      level="subcategory"
      hasChildren={false}
    />
  );
}
