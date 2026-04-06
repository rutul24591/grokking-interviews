'use client';
import { useRef, useEffect, useState, useCallback, type RefObject } from 'react';

interface CaptionCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  settings?: string;
}

interface CaptionRendererProps {
  mediaRef: RefObject<HTMLMediaElement | null>;
  captionsUrl?: string;
  enabled?: boolean;
  className?: string;
}

function parseWebVTT(text: string): CaptionCue[] {
  const lines = text.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n');
  const cues: CaptionCue[] = [];

  for (const block of lines) {
    const blockLines = block.trim().split('\n');
    if (blockLines.length < 2) continue;

    // Skip optional cue identifier
    let startIdx = 0;
    if (/^\d+$/.test(blockLines[0].trim())) startIdx = 1;

    const timingLine = blockLines[startIdx];
    const match = timingLine.match(/(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}:)?(\d{2}):(\d{2})[.,](\d{3})(.*)?/);
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
        .trim(),
      settings,
    });
  }

  return cues;
}

export function CaptionRenderer({ mediaRef, captionsUrl, enabled = false, className }: CaptionRendererProps) {
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [activeCue, setActiveCue] = useState<CaptionCue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cuesRef = useRef<CaptionCue[]>([]);

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
    return () => { cancelled = true; };
  }, [captionsUrl]);

  const findActiveCue = useCallback(() => {
    const media = mediaRef.current;
    if (!media || !enabled) {
      setActiveCue(null);
      return;
    }
    const time = media.currentTime;
    const matching = cuesRef.current.find(
      (c) => time >= c.startTime && time <= c.endTime
    );
    setActiveCue(matching ?? null);
  }, [mediaRef, enabled]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = findActiveCue;
    media.addEventListener('timeupdate', onTimeUpdate);
    return () => media.removeEventListener('timeupdate', onTimeUpdate);
  }, [mediaRef, findActiveCue]);

  if (!enabled || !activeCue) return null;

  return (
    <div className={`absolute bottom-20 left-0 right-0 text-center pointer-events-none ${className ?? ''}`}>
      <span className="inline-block bg-black/70 text-white px-4 py-2 rounded text-lg leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
        {activeCue.text}
      </span>
      {loading && (
        <span className="block text-xs text-gray-400 mt-1">Loading captions...</span>
      )}
      {error && (
        <span className="block text-xs text-red-400 mt-1">{error}</span>
      )}
    </div>
  );
}

export { parseWebVTT };
export type { CaptionCue };
