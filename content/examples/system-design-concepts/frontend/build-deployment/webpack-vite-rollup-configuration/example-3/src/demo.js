function detectBundlerReleaseRisk(state) {
  const blockers = [];

  if (state.pluginRemovedWithoutReplacement) blockers.push("build-may-pass-locally-but-fail-in-ci");
  if (state.outputFormatChanged && !state.consumerCompatibilityChecked) blockers.push("published-package-may-break-downstream-apps");
  if (state.bundleMapMissing) blockers.push("operators-cannot-explain-output-growth");
  if (state.previewUsesDifferentBuilder) blockers.push("preview-evidence-does-not-match-production-bundles");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", pluginRemovedWithoutReplacement: false, outputFormatChanged: false, consumerCompatibilityChecked: true, bundleMapMissing: false, previewUsesDifferentBuilder: false },
  { id: "unsafe", pluginRemovedWithoutReplacement: true, outputFormatChanged: true, consumerCompatibilityChecked: false, bundleMapMissing: true, previewUsesDifferentBuilder: true }
];

console.log(states.map(detectBundlerReleaseRisk));
