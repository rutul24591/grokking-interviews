'use client';
import { useState, useCallback, useEffect, useRef, type RefObject } from 'react';

export interface CaptionCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  settings?: string;
}

interface UseCaptionsOptions {
  mediaRef: RefObject<HTMLMediaElement | null>;
  captionsUrl?: string;
  enabled?: boolean;
  onCueChange?: (cue: CaptionCue | null) => void;
}

interface UseCaptionsReturn {
  cues: CaptionCue[];
  activeCue: CaptionCue | null;
  loading: boolean;
  error: string | null;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  toggle: () => void;
}

/**
 * Parse WebVTT text into CaptionCue objects.
 * Handles optional cue identifiers, timestamp formats with/without hours,
 * and strips WebVTT-specific markup tags.
 */
export function parseWebVTT(text: string): CaptionCue[] {
  const lines = text.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n');
  const cues: CaptionCue[] = [];

  for (const block of lines) {
    const blockLines = block.trim().split('\n');
    if (blockLines.length < 2) continue;

    let startIdx = 0;
    if (/^\d+$/.test(blockLines[0].trim())) startIdx = 1;

    const timingLine = blockLines[startIdx];
    const match = timingLine.match(
      /(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})(.*)?/
    );
    if (!match) continue;

    const toMs = (h: string, m: string, s: string, ms: string) => {
      const hours = h ? parseInt(h, 10) : 0;
      return hours * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10) + parseInt(ms, 10) / 1000;
    };

    const startTime = toMs(match[1] ?? '', match[2], match[3], match[4]);
    const endTime = toMs(match[5] ?? '', match[6], match[7], match[8]);
    const settings = match[9]?.trim();
    const textLines = blockLines.slice(startIdx + 1).join('\n');

    cues.push({
      id: `cue-${cues.length}`,
      startTime,
      endTime,
      text: textLines
        .replace(/<c\.?[^>]*>/g, '')
        .replace(/<\/c>/g, '')
        .replace(/<b>([^<]+)<\/b>/g, '**$1**')
        .replace(/<i>([^<]+)<\/i>/g, '*$1*')
        .replace(/<u>([^<]+)<\/u>/g, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim(),
      settings,
    });
  }

  return cues;
}

/**
 * Hook for WebVTT caption parsing, cue timing sync, and caption styling state.
 * Fetches and parses captions, tracks active cue based on media currentTime.
 */
export function useCaptions({
  mediaRef,
  captionsUrl,
  enabled = false,
  onCueChange,
}: UseCaptionsOptions): UseCaptionsReturn {
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [activeCue, setActiveCue] = useState<CaptionCue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const cuesRef = useRef<CaptionCue[]>([]);
  const lastCueIdRef = useRef<string | null>(null);

  // Load and parse WebVTT file
  useEffect(() => {
    if (!captionsUrl) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(captionsUrl);
        if (!res.ok) throw new Error(`Failed to load captions: ${res.status}`);
        const text = await res.text();
        if (cancelled) return;
        const parsed = parseWebVTT(text);
        cuesRef.current = parsed;
        setCues(parsed);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load captions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [captionsUrl]);

  // Find active cue based on media currentTime
  const findActiveCue = useCallback(() => {
    const media = mediaRef.current;
    if (!media || !isEnabled || cuesRef.current.length === 0) {
      if (activeCue !== null) {
        setActiveCue(null);
        lastCueIdRef.current = null;
        onCueChange?.(null);
      }
      return;
    }

    const time = media.currentTime;
    const matching = cuesRef.current.find(
      (c) => time >= c.startTime && time <= c.endTime
    );

    if (matching?.id !== lastCueIdRef.current) {
      lastCueIdRef.current = matching?.id ?? null;
      setActiveCue(matching ?? null);
      onCueChange?.(matching ?? null);
    }
  }, [mediaRef, isEnabled, activeCue, onCueChange]);

  // Track media time updates
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = findActiveCue;
    media.addEventListener('timeupdate', onTimeUpdate);
    return () => media.removeEventListener('timeupdate', onTimeUpdate);
  }, [mediaRef, findActiveCue]);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      if (!next) {
        setActiveCue(null);
        lastCueIdRef.current = null;
        onCueChange?.(null);
      }
      return next;
    });
  }, [onCueChange]);

  return {
    cues,
    activeCue,
    loading,
    error,
    enabled: isEnabled,
    setEnabled: setIsEnabled,
    toggle,
  };
}
