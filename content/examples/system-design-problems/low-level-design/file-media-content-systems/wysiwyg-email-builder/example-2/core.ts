export type WysiwygEmailBuilderStage = "empty" | "hydrating-template" | "editing-block" | "compiling" | "validating-clients" | "ready";

export type WysiwygEmailBuilderTransition = {
  command: string;
  from: WysiwygEmailBuilderStage;
  to: WysiwygEmailBuilderStage;
  revision: number;
};

export type WysiwygEmailBuilderState = {
  id: string;
  stage: WysiwygEmailBuilderStage;
  revision: number;
  audit: string[];
};

// Publish a versioned design only when generated HTML passes the supported email-client capability policy.
export function applyWysiwygEmailBuilderTransition(
  state: WysiwygEmailBuilderState,
  transition: WysiwygEmailBuilderTransition,
): WysiwygEmailBuilderState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid email design document transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runWysiwygEmailBuilderProtocolScenario() {
  const transitions: WysiwygEmailBuilderTransition[] = [
  { command: "load-template", from: "empty", to: "hydrating-template", revision: 1 },
  { command: "edit-block", from: "hydrating-template", to: "editing-block", revision: 2 },
  { command: "compile-responsive-html", from: "editing-block", to: "compiling", revision: 3 },
  { command: "validate-client-matrix", from: "compiling", to: "validating-clients", revision: 4 },
  { command: "publish-version", from: "validating-clients", to: "ready", revision: 5 },
  ];
  return transitions.reduce(applyWysiwygEmailBuilderTransition, {
    id: "wysiwyg-email-builder-case-17",
    stage: "empty",
    revision: 0,
    audit: [],
  });
}

export const WysiwygEmailBuilderInvariant =
  "Publish a versioned design only when generated HTML passes the supported email-client capability policy.";
