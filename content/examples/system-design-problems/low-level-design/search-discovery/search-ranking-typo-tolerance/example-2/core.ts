export interface StrategyMetrics {
  strategyVersion: string;
  impressions: number;
  clicks: number;
  correctionUndos: number;
  reformulations: number;
  emptyResults: number;
}

export function evaluateRollout(candidate: StrategyMetrics, baseline: StrategyMetrics) {
  const ratio = (value: number, total: number) => total === 0 ? 0 : value / total;
  const candidateUndo = ratio(candidate.correctionUndos, candidate.impressions);
  const baselineUndo = ratio(baseline.correctionUndos, baseline.impressions);
  const candidateReformulation = ratio(candidate.reformulations, candidate.impressions);
  const baselineReformulation = ratio(baseline.reformulations, baseline.impressions);
  const reasons: string[] = [];

  if (candidateUndo > baselineUndo + 0.02) reasons.push("correction-undo-regression");
  if (candidateReformulation > baselineReformulation + 0.03) reasons.push("reformulation-regression");
  if (candidate.emptyResults > baseline.emptyResults * 1.1) reasons.push("empty-result-regression");

  return {
    promote: reasons.length === 0,
    reasons,
    rollbackTo: baseline.strategyVersion,
    evidence: { candidateUndo, baselineUndo, candidateReformulation, baselineReformulation },
  };
}

export function runRolloutScenario() {
  return evaluateRollout(
    { strategyVersion: "v2", impressions: 1000, clicks: 600, correctionUndos: 55, reformulations: 120, emptyResults: 20 },
    { strategyVersion: "v1", impressions: 1000, clicks: 610, correctionUndos: 10, reformulations: 70, emptyResults: 18 },
  );
}
