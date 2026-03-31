export function renderInspector(container, suggestions) {
  const derivedMetrics = suggestions.map((label, index) => ({
    label,
    simulatedCostMs: 40 + index * 18,
  }));

  container.innerHTML = `
    <strong>Heavy inspector chunk loaded.</strong><br />
    ${derivedMetrics.map((metric) => `${metric.label}: ${metric.simulatedCostMs}ms`).join("<br />")}
  `;
}
