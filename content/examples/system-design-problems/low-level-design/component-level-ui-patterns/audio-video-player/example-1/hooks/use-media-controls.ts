'use client';
import { useRef, useEffect, useCallback, useState, type RefObject } from 'react';

interface UseMediaControlsOptions {
  mediaRef: RefObject<HTMLMediaElement | null>;
  onPlayStateChange?: (playing: boolean) => void;
}

interface MediaState {
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  buffered: number;
  seeking: boolean;
}

export function useMediaControls({ mediaRef, onPlayStateChange }: UseMediaControlsOptions) {
  const [state, setState] = useState<MediaState>({
    paused: true,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    buffered: 0,
    seeking: false,
  });

  const rafRef = useRef<number | null>(null);
  const shortcutsEnabledRef = useRef(true);

  const updateState = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    setState((prev) => ({
      ...prev,
      currentTime: media.currentTime,
      duration: media.duration || 0,
      volume: media.volume,
      muted: media.muted,
      playbackRate: media.playbackRate,
      buffered: media.buffered.length > 0 ? media.buffered.end(media.buffered.length - 1) : 0,
    }));
    rafRef.current = requestAnimationFrame(updateState);
  }, [mediaRef]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onPlay = () => {
      setState((p) => ({ ...p, paused: false }));
      onPlayStateChange?.(true);
      rafRef.current = requestAnimationFrame(updateState);
    };
    const onPause = () => {
      setState((p) => ({ ...p, paused: true }));
      onPlayStateChange?.(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    const onLoadedMetadata = () => {
      setState((p) => ({ ...p, duration: media.duration }));
    };

    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onPause);
    media.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onPause);
      media.removeEventListener('loadedmetadata', onLoadedMetadata);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mediaRef, updateState, onPlayStateChange]);

  const togglePlay = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.paused ? media.play().catch(() => {}) : media.pause();
  }, [mediaRef]);

  const seek = useCallback((time: number) => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = Math.max(0, Math.min(time, media.duration || 0));
  }, [mediaRef]);

  const setVolume = useCallback((v: number) => {
    const media = mediaRef.current;
    if (!media) return;
    const clamped = Math.max(0, Math.min(1, v));
    media.volume = clamped;
    media.muted = clamped === 0;
  }, [mediaRef]);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !media.muted;
  }, [mediaRef]);

  const setPlaybackRate = useCallback((rate: number) => {
    const media = mediaRef.current;
    if (!media) return;
    media.playbackRate = rate;
  }, [mediaRef]);

  const skip = useCallback((seconds: number) => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = Math.max(0, Math.min(media.currentTime + seconds, media.duration || 0));
  }, [mediaRef]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!shortcutsEnabledRef.current) return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          skip(-5);
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          skip(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(state.volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(state.volume - 0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case '>':
          setPlaybackRate(Math.min(state.playbackRate * 1.25, 2));
          break;
        case '<':
          setPlaybackRate(Math.max(state.playbackRate / 1.25, 0.25));
          break;
      }
    },
    [togglePlay, skip, setVolume, toggleMute, setPlaybackRate, state.volume, state.playbackRate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const enableShortcuts = useCallback(() => { shortcutsEnabledRef.current = true; }, []);
  const disableShortcuts = useCallback(() => { shortcutsEnabledRef.current = false; }, []);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    state,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    skip,
    formatTime,
    enableShortcuts,
    disableShortcuts,
  };
}
