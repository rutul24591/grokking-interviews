function shouldAutosave({ idleMs, dirty }) {
  return {
    trigger: dirty && idleMs >= 1500,
    reason: dirty && idleMs >= 1500 ? "debounce-window-elapsed" : "keep-buffering"
  };
}

console.log(shouldAutosave({ idleMs: 1800, dirty: true }));
