const scenarios = [
  { rows: 40, variableHeights: false },
  { rows: 600, variableHeights: false },
  { rows: 6000, variableHeights: true },
];
for (const scenario of scenarios) {
  const recommendation = scenario.rows < 100 ? "no virtualization needed" : scenario.variableHeights ? "virtualize with measurement support" : "fixed-size virtualization";
  console.log(`${JSON.stringify(scenario)} -> ${recommendation}`);
}
