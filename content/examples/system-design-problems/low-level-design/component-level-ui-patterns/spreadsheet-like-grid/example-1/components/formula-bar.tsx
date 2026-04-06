'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

interface FormulaBarProps {
  cellId: string;
  cellValue: string;
  cellFormula?: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  className?: string;
}

export function FormulaBar({
  cellId,
  cellValue,
  cellFormula,
  onValueChange,
  onSubmit,
  onCancel,
  className = '',
}: FormulaBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(cellValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const draftValueRef = useRef(draftValue);

  useEffect(() => {
    draftValueRef.current = draftValue;
  }, [draftValue]);

  // Sync when cell changes externally
  useEffect(() => {
    if (!isEditing) {
      setDraftValue(cellValue);
    }
  }, [cellValue, isEditing]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setDraftValue(cellFormula || cellValue);
  }, [cellFormula, cellValue]);

  const commit = useCallback(() => {
    if (!isEditing) return;
    onValueChange(draftValueRef.current);
    setIsEditing(false);
    onSubmit();
  }, [isEditing, onValueChange, onSubmit]);

  const cancel = useCallback(() => {
    setDraftValue(cellFormula || cellValue);
    setIsEditing(false);
    onCancel();
  }, [cellFormula, cellValue, onCancel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commit();
      }
    },
    [commit, cancel]
  );

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 ${className}`}>
      {/* Cell reference */}
      <div className="w-16 flex-shrink-0">
        <input
          readOnly
          value={cellId}
          className="w-full px-2 py-1 text-sm font-mono bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-700 dark:text-gray-300"
          aria-label="Selected cell reference"
        />
      </div>

      {/* Formula icon */}
      <div className="text-gray-400 dark:text-gray-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {/* Value / formula input */}
      <div className="flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            className="w-full px-2 py-1 text-sm font-mono bg-white dark:bg-gray-700 border border-blue-400 dark:border-blue-600 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Cell value or formula"
          />
        ) : (
          <input
            readOnly
            value={cellFormula || cellValue}
            onFocus={startEditing}
            onClick={startEditing}
            className="w-full px-2 py-1 text-sm font-mono bg-transparent border border-transparent rounded text-gray-900 dark:text-gray-100 cursor-text hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            aria-label="Cell value or formula (click to edit)"
          />
        )}
      </div>

      {/* Action buttons when editing */}
      {isEditing && (
        <div className="flex items-center gap-1">
          <button
            onClick={cancel}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
            aria-label="Cancel editing"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={commit}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-green-600"
            aria-label="Confirm value"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
