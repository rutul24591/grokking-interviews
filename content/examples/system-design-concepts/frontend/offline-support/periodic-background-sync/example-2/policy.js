function chooseIntervalMinutes(signal) {
  const base = signal.contentClass === "high-churn" ? 60 : 240;
  let interval = base;

  if (signal.saveData) interval *= 2;
  if (signal.batteryLevel < 0.25) interval *= 2;
  if (signal.effectiveType === "2g") interval *= 3;
  if (signal.effectiveType === "3g") interval *= 1.5;
  if (!signal.userEngagedRecently) interval *= 2;

  return Math.round(Math.max(30, interval));
}

const scenarios = [
  { name: "desktop-wifi-engaged", effectiveType: "4g", saveData: false, batteryLevel: 0.9, userEngagedRecently: true, contentClass: "high-churn" },
  { name: "mobile-low-battery", effectiveType: "4g", saveData: false, batteryLevel: 0.12, userEngagedRecently: true, contentClass: "high-churn" },
  { name: "data-saver-3g", effectiveType: "3g", saveData: true, batteryLevel: 0.7, userEngagedRecently: true, contentClass: "medium-churn" },
  { name: "rarely-opened-app", effectiveType: "4g", saveData: false, batteryLevel: 0.5, userEngagedRecently: false, contentClass: "medium-churn" }
];

for (const scenario of scenarios) {
  const mins = chooseIntervalMinutes(scenario);
  // eslint-disable-next-line no-console
  console.log(`${scenario.name.padEnd(22)} => ${String(mins).padStart(4)} min`);
}

