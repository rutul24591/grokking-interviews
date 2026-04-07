function planResizeDrivenLayout(config) {
  const actions = [];
  if (config.syncWriteBack) actions.push("remove-sync-write-back");
  if (config.expensiveRedraw) actions.push("throttle-redraw");
  if (!config.breakpointFallbackVisible) actions.push("restore-breakpoint-fallback");
  return {
    id: config.id,
    actions,
    layoutMode: config.syncWriteBack ? "breakpoints" : "container-buckets",
    shipReady: !actions.includes("remove-sync-write-back")
  };
}

const configs = [
  { id: "panels", syncWriteBack: false, expensiveRedraw: false, breakpointFallbackVisible: true },
  { id: "chart", syncWriteBack: false, expensiveRedraw: true, breakpointFallbackVisible: true },
  { id: "loop", syncWriteBack: true, expensiveRedraw: true, breakpointFallbackVisible: false }
];

console.log(configs.map(planResizeDrivenLayout));
