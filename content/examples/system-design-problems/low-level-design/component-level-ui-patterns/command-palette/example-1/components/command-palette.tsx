'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { registry } from './lib/command-registry';
import { filterAndRank } from './lib/fuzzy-matcher';
import { useCommandPaletteStore } from './lib/command-palette-store';

export function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = useCommandPaletteStore((s) => s.isOpen);
  const query = useCommandPaletteStore((s) => s.query);
  const results = useCommandPaletteStore((s) => s.results);
  const highlightIndex = useCommandPaletteStore((s) => s.highlightIndex);
  const setQuery = useCommandPaletteStore((s) => s.setQuery);
  const setResults = useCommandPaletteStore((s) => s.setResults);
  const setHighlight = useCommandPaletteStore((s) => s.setHighlight);
  const executeCommand = useCommandPaletteStore((s) => s.executeCommand);
  const close = useCommandPaletteStore((s) => s.close);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); isOpen ? close() : useCommandPaletteStore.getState().open(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  useEffect(() => {
    const commands = registry.getAll();
    const filtered = filterAndRank(commands, query);
    setResults(filtered.slice(0, 10));
  }, [query, setResults]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(highlightIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(highlightIndex - 1); }
    else if (e.key === 'Enter' && results[highlightIndex]) { e.preventDefault(); executeCommand(results[highlightIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  }, [highlightIndex, results, setHighlight, executeCommand, close]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50" onClick={() => close()}>
      <div className="w-full max-w-xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={(e) => e.stopPropagation()} role="combobox" aria-expanded={isOpen}>
        <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder="Type a command or search..." className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none text-lg" aria-label="Search commands" />
        <div role="listbox" className="max-h-80 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
          {results.length === 0 && query && <div className="px-4 py-8 text-center text-gray-500 text-sm">No results found</div>}
          {results.map((cmd, i) => (
            <div key={cmd.id} role="option" aria-selected={i === highlightIndex} className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${i === highlightIndex ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => executeCommand(cmd)} onMouseEnter={() => setHighlight(i)}>
              {cmd.icon && <span className="w-5 h-5">{cmd.icon}</span>}
              <span className="flex-1 text-sm">{cmd.label}</span>
              {cmd.shortcut && <kbd className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">{cmd.shortcut}</kbd>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
