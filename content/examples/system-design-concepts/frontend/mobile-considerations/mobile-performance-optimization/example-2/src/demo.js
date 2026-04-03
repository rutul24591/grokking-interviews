function chooseMobilePerformanceProfile(device) {
  const allowHeavyCharts = device.cpuBudget === "comfortable" && device.memoryMb >= 768;
  const hydrationPlan = device.longTaskMs > 150 ? "split-or-minimal-hydration" : device.hydrationMode;
  return {
    id: device.id,
    allowHeavyCharts,
    hydrationPlan,
    searchMode: device.longTaskMs > 150 ? "manual-or-batched-live-search" : "standard-live-search"
  };
}

const devices = [
  { id: "entry", cpuBudget: "critical", memoryMb: 256, hydrationMode: "minimal-islands", longTaskMs: 240 },
  { id: "mid", cpuBudget: "tight", memoryMb: 512, hydrationMode: "split-sections", longTaskMs: 130 },
  { id: "high", cpuBudget: "comfortable", memoryMb: 1024, hydrationMode: "full-interactive", longTaskMs: 40 }
];

console.log(devices.map(chooseMobilePerformanceProfile));
