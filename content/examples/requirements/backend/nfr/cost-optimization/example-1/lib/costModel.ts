export type CostScenario = {
  monthlyRequests: number;
  avgResponseKb: number;
  cacheHitRate: number; // 0..1

  originComputeUsdPerMillion: number; // simplified “compute” unit
  reservedDiscount: number; // 0..1 applied to origin compute only

  cdnEgressUsdPerGb: number;
  storageGb: number;
  storageUsdPerGbMonth: number;

  budgetUsd: number;
};

export type CostBreakdown = {
  originRequests: number;
  cdnRequests: number;
  egressGb: number;
  costs: {
    originComputeUsd: number;
    cdnEgressUsd: number;
    storageUsd: number;
    totalUsd: number;
  };
  guardrail: { withinBudget: boolean; budgetUsd: number; totalUsd: number };
  recommendations: { title: string; impactHint: string }[];
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function estimateMonthlyCost(s: CostScenario): CostBreakdown {
  const cacheHitRate = clamp01(s.cacheHitRate);
  const originRequests = Math.round(s.monthlyRequests * (1 - cacheHitRate));
  const cdnRequests = s.monthlyRequests;

  const egressGb = (s.monthlyRequests * s.avgResponseKb) / 1024 / 1024;
  const originComputeRaw = (originRequests / 1_000_000) * s.originComputeUsdPerMillion;
  const originComputeUsd = originComputeRaw * (1 - clamp01(s.reservedDiscount));

  const cdnEgressUsd = egressGb * s.cdnEgressUsdPerGb;
  const storageUsd = s.storageGb * s.storageUsdPerGbMonth;
  const totalUsd = originComputeUsd + cdnEgressUsd + storageUsd;

  const recommendations: CostBreakdown["recommendations"] = [];
  if (cacheHitRate < 0.7) {
    recommendations.push({
      title: "Increase cache hit rate",
      impactHint: "Reduces origin compute and downstream dependency load."
    });
  }
  if (s.avgResponseKb > 32) {
    recommendations.push({
      title: "Reduce payload size / enable compression",
      impactHint: "Reduces CDN egress costs and improves latency."
    });
  }
  if (s.reservedDiscount < 0.2) {
    recommendations.push({
      title: "Consider reserved capacity for steady baseline",
      impactHint: "Discounts apply to baseline compute; keep burst on on-demand/spot."
    });
  }

  return {
    originRequests,
    cdnRequests,
    egressGb: Math.round(egressGb * 100) / 100,
    costs: {
      originComputeUsd: Math.round(originComputeUsd * 100) / 100,
      cdnEgressUsd: Math.round(cdnEgressUsd * 100) / 100,
      storageUsd: Math.round(storageUsd * 100) / 100,
      totalUsd: Math.round(totalUsd * 100) / 100
    },
    guardrail: {
      withinBudget: totalUsd <= s.budgetUsd,
      budgetUsd: s.budgetUsd,
      totalUsd: Math.round(totalUsd * 100) / 100
    },
    recommendations
  };
}

