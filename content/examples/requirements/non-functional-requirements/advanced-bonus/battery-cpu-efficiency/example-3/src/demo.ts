type RenderPass = { surface: string; cpuMs: number; fps: number; batteryDropPerHour: number };

function flagExpensiveSurface(renderPass: RenderPass) {
  const unstableFps = renderPass.fps < 45;
  const batteryHeavy = renderPass.batteryDropPerHour > 12;
  return {
    surface: renderPass.surface,
    unstableFps,
    batteryHeavy,
    action: unstableFps || batteryHeavy ? 'downgrade-animation-quality' : 'keep-rich-rendering',
  };
}

const results = [
  { surface: 'marketing-hero', cpuMs: 7, fps: 58, batteryDropPerHour: 8 },
  { surface: 'live-dashboard', cpuMs: 19, fps: 37, batteryDropPerHour: 16 },
].map(flagExpensiveSurface);

console.table(results);
if (results[1].action !== 'downgrade-animation-quality') throw new Error('Dashboard should be downgraded on weak devices');
