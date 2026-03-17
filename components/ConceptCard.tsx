"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { classNames } from "@/lib/classNames";

type ConceptCardProps = {
  title: string;
  slug: string;
  description?: string;
  href: string;
};

/**
 * Concept Card Component
 *
 * Displays a concept/topic as a clickable card with hover effects.
 * Used on subcategory pages to show all available concepts.
 */
export function ConceptCard({
  title,
  slug,
  description,
  href,
}: ConceptCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link
        href={href}
        className={classNames(
          "group flex h-full flex-col rounded-2xl border border-theme bg-panel-soft p-6",
          "transition hover:border-accent hover:shadow-soft-theme",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        )}
      >
        {/* Icon/Indicator */}
        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-heading group-hover:text-accent">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="flex-1 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}

        {/* Learn More Link */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent opacity-0 transition group-hover:opacity-100">
          <span>Read article</span>
          <span aria-hidden="true">→</span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Concept Grid Component
 *
 * Responsive grid layout for concept cards.
 */
type ConceptGridProps = {
  children: React.ReactNode;
};

export function ConceptGrid({ children }: ConceptGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}
