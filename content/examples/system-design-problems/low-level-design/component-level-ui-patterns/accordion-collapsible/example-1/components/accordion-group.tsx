'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { useAccordion } from '../hooks/use-accordion';
import type { AccordionMode } from '../lib/accordion-types';

interface AccordionGroupContextValue {
  mode: AccordionMode;
  openId: string | null;
  openIds: Set<string>;
  toggle: (id: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const AccordionGroupContext = createContext<AccordionGroupContextValue | null>(null);

function useAccordionGroupContext() {
  const ctx = useContext(AccordionGroupContext);
  if (!ctx) throw new Error('AccordionItem must be used within AccordionGroup');
  return ctx;
}

export function AccordionGroup({
  mode = 'exclusive',
  defaultOpen,
  animated = true,
  children,
  itemCount,
  className,
}: {
  mode?: AccordionMode;
  defaultOpen?: string | string[];
  animated?: boolean;
  children: ReactNode;
  itemCount: number;
  className?: string;
}) {
  const { openId, openIds, toggle, handleKeyDown } = useAccordion({
    mode,
    defaultOpen,
    totalItems: itemCount,
  });

  return (
    <AccordionGroupContext.Provider
      value={{ mode, openId, openIds, toggle, handleKeyDown }}
    >
      <div
        className={`space-y-2 ${animated ? 'transition-all duration-200' : ''} ${className ?? ''}`}
        role="region"
        aria-label="Accordion group"
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </AccordionGroupContext.Provider>
  );
}

export function AccordionItemGroup({
  id,
  title,
  children,
  disabled = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  const { mode, openId, openIds, toggle } = useAccordionGroupContext();
  const isOpen = mode === 'exclusive' ? openId === id : openIds.has(id);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={() => !disabled && toggle(id)}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          id={`header-${id}`}
          className="flex items-center justify-between w-full px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`header-${id}`}
        className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-3 text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
}
