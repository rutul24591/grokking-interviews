export type Shortcut = { keys: string; action: string };

export const defaultShortcuts: Shortcut[] = [
  { keys: "Space", action: "togglePlay" },
  { keys: "ArrowLeft", action: "seekBack5s" },
  { keys: "ArrowRight", action: "seekForward5s" },
  { keys: "KeyM", action: "toggleMute" },
  { keys: "KeyF", action: "toggleFullscreen" },
];

