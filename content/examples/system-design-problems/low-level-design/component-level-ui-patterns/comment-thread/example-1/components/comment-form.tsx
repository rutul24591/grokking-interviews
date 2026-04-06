'use client';

import { useState, useCallback } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
  isEditing?: boolean;
}

const MAX_CHARS = 5000;

export function CommentForm({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = 'Write a comment...',
  isEditing = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const isValid = content.trim().length > 0 && charCount <= MAX_CHARS;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!isValid) {
        if (content.trim().length === 0) {
          setError('Comment cannot be empty');
        } else if (charCount > MAX_CHARS) {
          setError(`Comment exceeds ${MAX_CHARS} character limit`);
        }
        return;
      }

      setError(null);
      onSubmit(content.trim());
      setContent('');
    },
    [content, isValid, charCount, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }

      // Escape to cancel
      if (e.key === 'Escape' && onCancel) {
        e.preventDefault();
        onCancel();
      }
    },
    [handleSubmit, onCancel]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      if (error) setError(null); // Clear error on edit
    },
    [error]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" role="form" aria-label={isEditing ? 'Edit comment form' : 'Reply form'}>
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-md border border-theme bg-panel p-3 text-sm leading-relaxed placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        aria-invalid={!isValid && content.length > 0}
        aria-describedby={error ? 'comment-form-error' : undefined}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${charCount > MAX_CHARS ? 'text-red-500' : 'text-muted'}`}>
            {charCount}/{MAX_CHARS}
          </span>
          {error && (
            <span id="comment-form-error" className="text-xs text-red-500" role="alert">
              {error}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent/90"
          >
            {isEditing ? 'Update' : 'Reply'}
          </button>
        </div>
      </div>
    </form>
  );
}
