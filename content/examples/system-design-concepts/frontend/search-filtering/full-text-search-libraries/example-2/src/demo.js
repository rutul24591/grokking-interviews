function chooseLibraryStrategy(config) {
  const actions = [];
  if (config.falsePositiveRisk) actions.push("tighten-fuzziness");
  if (!config.stemming) actions.push("restore-stemming-or-synonyms");
  if (config.highlightMismatchRisk) actions.push("fallback-to-plain-snippets");

  return {
    id: config.id,
    tightenFuzziness: config.falsePositiveRisk,
    keepStemming: config.stemming,
    rankingReview: config.weighting === "title-heavy" ? "title-relevance-first" : "field-balance-review",
    actions,
    shipReady: actions.length === 0
  };
}

const configs = [
  { id: "mini", falsePositiveRisk: false, stemming: true, weighting: "title-heavy", highlightMismatchRisk: false },
  { id: "fuse", falsePositiveRisk: true, stemming: false, weighting: "summary-balanced", highlightMismatchRisk: true },
  { id: "lunr", falsePositiveRisk: false, stemming: true, weighting: "keyword-boosted", highlightMismatchRisk: false }
];

const plans = configs.map(chooseLibraryStrategy);
console.log(plans);
console.log({ shipReady: plans.filter((item) => item.shipReady).map((item) => item.id), repairQueue: plans.filter((item) => !item.shipReady).length });
