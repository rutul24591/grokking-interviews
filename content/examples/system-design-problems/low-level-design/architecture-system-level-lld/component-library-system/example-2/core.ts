export type ChangeKind = "patch" | "minor" | "major";
export interface ComponentChange { component: string; kind: ChangeKind; migrationGuide?: string; codemod?: string; visualApproved: boolean; a11yPassed: boolean; }
export interface ReleaseDecision { allowed: boolean; reasons: string[]; requiredActions: string[]; }
export function evaluateRelease(changes: ComponentChange[]): ReleaseDecision {
  const reasons: string[] = []; const requiredActions: string[] = [];
  for (const change of changes) {
    if (!change.visualApproved) reasons.push(change.component + ":visual-review-missing");
    if (!change.a11yPassed) reasons.push(change.component + ":a11y-regression");
    if (change.kind === "major" && !change.migrationGuide) requiredActions.push(change.component + ":write-migration-guide");
    if (change.kind === "major" && !change.codemod) requiredActions.push(change.component + ":provide-codemod-or-justify");
  }
  return { allowed: reasons.length === 0 && requiredActions.length === 0, reasons, requiredActions };
}
export function runReleaseScenario() {
  return evaluateRelease([{ component: "Button", kind: "major", visualApproved: true, a11yPassed: true, migrationGuide: "button-v3.md" }]);
}
