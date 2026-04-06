'use client';

import React from 'react';
import type { Tag } from '../lib/multi-select-types';

interface TagPillProps<T = Record<string, unknown>> {
  tag: Tag<T>;
  onRemove: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    border: 'border-accent/30',
  },
  user: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
  },
  label: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30',
  },
  category: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/30',
  },
};

export function TagPill<T = Record<string, unknown>>({ tag, onRemove }: TagPillProps<T>) {
  const colors = TAG_COLORS[tag.type ?? 'default'];
  const bgClass = tag.color ? tag.color : colors.bg;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border ${bgClass} ${colors.text} ${colors.border} transition-all duration-150`}
      data-tag-id={tag.id}
    >
      {/* Avatar for user-type tags */}
      {tag.type === 'user' && tag.avatarUrl && (
        <img
          src={tag.avatarUrl}
          alt=""
          className="w-4 h-4 rounded-full"
          loading="lazy"
        />
      )}

      {/* Color dot for non-user tags */}
      {tag.type !== 'user' && tag.color && (
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: tag.color }}
          aria-hidden="true"
        />
      )}

      <span className="max-w-[120px] truncate">{tag.label}</span>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className={`ml-0.5 p-0.5 rounded-full hover:${colors.bg} focus:outline-none focus:ring-1 focus:ring-accent transition-colors`}
        aria-label={`Remove ${tag.label}`}
        tabIndex={0}
      >
        <svg
          className="w-3 h-3"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}
