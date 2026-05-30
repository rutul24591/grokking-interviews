export type VisibilityBasedRenderingSystemOutcome = "accepted" | "unsupported" | "permission-denied" | "fallback" | "cancelled";

export interface VisibilityBasedRenderingSystemCapability {
  apiPresent: boolean;
  secureContext: boolean;
  permission: "granted" | "prompt" | "denied" | "unknown";
  documentVisible: boolean;
  userActivation: boolean;
}

export interface VisibilityBasedRenderingSystemDecision {
  outcome: VisibilityBasedRenderingSystemOutcome;
  allowed: boolean;
  fallback: "none" | "manual-control" | "read-only" | "defer-until-visible";
  reasons: string[];
}

export function decideVisibilityBasedRenderingSystemCapability(capability: VisibilityBasedRenderingSystemCapability): VisibilityBasedRenderingSystemDecision {
  const reasons: string[] = [];
  if (!capability.apiPresent) reasons.push("api-missing");
  if (!capability.secureContext) reasons.push("insecure-context");
  if (capability.permission === "denied") reasons.push("permission-denied");
  if (!capability.documentVisible) reasons.push("document-hidden");
  if (!capability.userActivation) reasons.push("missing-user-activation");

  if (reasons.includes("permission-denied")) return { outcome: "permission-denied", allowed: false, fallback: "manual-control", reasons };
  if (reasons.includes("api-missing") || reasons.includes("insecure-context")) return { outcome: "unsupported", allowed: false, fallback: "manual-control", reasons };
  if (reasons.includes("document-hidden")) return { outcome: "fallback", allowed: false, fallback: "defer-until-visible", reasons };
  if (reasons.includes("missing-user-activation")) return { outcome: "fallback", allowed: false, fallback: "manual-control", reasons };
  return { outcome: "accepted", allowed: true, fallback: "none", reasons };
}

export function runVisibilityBasedRenderingSystemCapabilityScenario() {
  const accepted = decideVisibilityBasedRenderingSystemCapability({ apiPresent: true, secureContext: true, permission: "granted", documentVisible: true, userActivation: true });
  const fallback = decideVisibilityBasedRenderingSystemCapability({ apiPresent: true, secureContext: true, permission: "prompt", documentVisible: false, userActivation: false });
  return { invariant: "Hidden or offscreen UI should stop expensive work without losing state or surprising the user on resume.", accepted, fallback };
}

export function explainVisibilityBasedRenderingSystemOutcome(decision: VisibilityBasedRenderingSystemDecision): string {
  if (decision.allowed) return "native-browser-path-safe";
  if (decision.fallback === "defer-until-visible") return "pause-until-document-visible";
  if (decision.outcome === "permission-denied") return "show-permission-recovery-copy";
  if (decision.outcome === "unsupported") return "render-manual-fallback";
  return "block-unsafe-browser-call";
}

export function shouldRetryVisibilityBasedRenderingSystemLater(decision: VisibilityBasedRenderingSystemDecision): boolean {
  return decision.reasons.includes("document-hidden") || decision.reasons.includes("missing-user-activation");
}

export function buildVisibilityBasedRenderingSystemUserMessage(decision: VisibilityBasedRenderingSystemDecision): string {
  if (decision.allowed) return "Ready";
  if (decision.reasons.includes("permission-denied")) return "Permission is blocked. Use the manual option or change browser settings.";
  if (decision.reasons.includes("api-missing")) return "This browser does not support the enhanced action. Use the fallback.";
  if (decision.reasons.includes("document-hidden")) return "The action will resume when this tab is visible.";
  return "The action needs a fresh user gesture.";
}

export const VisibilityBasedRenderingSystemExampleInvariant = "Hidden or offscreen UI should stop expensive work without losing state or surprising the user on resume.";
