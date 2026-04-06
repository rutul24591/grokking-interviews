'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AccordionConfig, AccordionContextValue, AccordionItemProps } from './accordion-types';

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion.Item must be used within Accordion');
  return ctx;
}

export function Accordion({ mode, defaultOpen, animated = true, children }: AccordionConfig & { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(mode === 'exclusive' ? (defaultOpen as string) ?? null : null);
  const [openIds, setOpenIds] = useState<Set<string>>(
    mode === 'independent' ? new Set(Array.isArray(defaultOpen) ? defaultOpen : defaultOpen ? [defaultOpen] : []) : new Set()
  );
  const [disabledIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    if (mode === 'exclusive') {
      setOpenId((prev) => (prev === id ? null : id));
    } else {
      setOpenIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  }, [mode]);

  const open = useCallback((id: string) => {
    if (mode === 'exclusive') setOpenId(id);
    else setOpenIds((prev) => new Set(prev).add(id));
  }, [mode]);

  const close = useCallback((id: string) => {
    if (mode === 'exclusive') setOpenId(null);
    else setOpenIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, [mode]);

  return (
    <AccordionContext.Provider value={{ mode, openId, openIds, toggle, open, close, disabledIds }}>
      <div className={`space-y-2 ${animated ? 'transition-all duration-200' : ''}`} role="region" aria-label="Accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ id, title, content, disabled }: AccordionItemProps) {
  const { mode, openId, openIds, toggle, disabledIds } = useAccordionContext();
  const isOpen = mode === 'exclusive' ? openId === id : openIds.has(id);
  const isDisabled = disabled || disabledIds.has(id);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={() => !isDisabled && toggle(id)}
          disabled={isDisabled}
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          id={`header-${id}`}
          className="flex items-center justify-between w-full px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{title}</span>
          <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </h3>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`header-${id}`}
        className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-3 text-gray-700 dark:text-gray-300">{content}</div>
        </div>
      </div>
    </div>
  );
}
