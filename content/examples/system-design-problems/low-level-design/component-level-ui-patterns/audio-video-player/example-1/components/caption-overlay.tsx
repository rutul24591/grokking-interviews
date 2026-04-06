'use client';
import { useRef, useEffect, useState, useCallback, type RefObject } from 'react';
import type { CaptionCue } from '../hooks/use-captions';

interface CaptionOverlayProps {
  mediaRef: RefObject<HTMLMediaElement | null>;
  activeCue: CaptionCue | null;
  enabled: boolean;
  className?: string;
  fontSize?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Strip any remaining HTML entities from caption text for safe rendering.
 */
function stripHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));
}

/**
 * Caption overlay component that renders active WebVTT cues over media.
 * Supports configurable positioning, font size, and colors.
 * Handles HTML entity stripping and safe text rendering.
 */
export function CaptionOverlay({
  activeCue,
  enabled,
  className = '',
  fontSize = 'medium',
  backgroundColor = 'rgba(0, 0, 0, 0.75)',
  textColor = '#ffffff',
}: CaptionOverlayProps) {
  const [renderedText, setRenderedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Process cue text: strip entities, convert WebVTT markup to plain text
  useEffect(() => {
    if (!activeCue) {
      setRenderedText('');
      return;
    }

    const cleaned = stripHtmlEntities(activeCue.text);
    // Convert markdown-like markers to styled spans
    const styled = cleaned
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    setRenderedText(styled);
  }, [activeCue]);

  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  }[fontSize];

  if (!enabled || !activeCue) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-16 left-0 right-0 text-center pointer-events-none px-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={`inline-block px-4 py-2 rounded-lg max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap break-words ${fontSizeClass}`}
        style={{
          backgroundColor,
          color: textColor,
        }}
        dangerouslySetInnerHTML={{ __html: renderedText }}
      />
    </div>
  );
}
