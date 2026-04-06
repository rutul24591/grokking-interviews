/**
 * Audio/Video Player — Keyboard shortcut conflict resolution.
 *
 * Interview edge case: User presses Space to pause video, but Space also scrolls
 * the page. User presses M to mute, but M is used by another app. Solution:
 * player must capture keyboard events when focused, prevent default for media
 * shortcuts, and provide visible shortcut hints.
 */

import { useRef, useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  onPlayPause: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onToggleMute: () => void;
  onToggleCaptions: () => void;
  onToggleFullscreen: () => void;
}

/**
 * Hook that manages keyboard shortcuts for media player.
 * Prevents default browser behavior for media shortcuts when player is focused.
 */
export function useMediaShortcuts(config: ShortcutConfig, containerRef: React.RefObject<HTMLElement | null>) {
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle when player container is focused or within it
    if (!containerRef.current?.contains(document.activeElement)) return;

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        config.onPlayPause();
        break;
      case 'ArrowRight':
      case 'l':
        e.preventDefault();
        config.onSeekForward();
        break;
      case 'ArrowLeft':
      case 'j':
        e.preventDefault();
        config.onSeekBackward();
        break;
      case 'ArrowUp':
        e.preventDefault();
        config.onVolumeUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        config.onVolumeDown();
        break;
      case 'm':
        e.preventDefault();
        config.onToggleMute();
        break;
      case 'c':
        e.preventDefault();
        config.onToggleCaptions();
        break;
      case 'f':
        e.preventDefault();
        config.onToggleFullscreen();
        break;
    }
  }, [config, containerRef]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  /**
   * Returns a map of shortcut labels for display in the UI.
   */
  const shortcutLabels: Record<string, string> = {
    'Play/Pause': 'Space / K',
    'Seek Forward': '→ / L',
    'Seek Backward': '← / J',
    'Volume Up': '↑',
    'Volume Down': '↓',
    'Toggle Mute': 'M',
    'Toggle Captions': 'C',
    'Toggle Fullscreen': 'F',
  };

  return { shortcutLabels };
}
