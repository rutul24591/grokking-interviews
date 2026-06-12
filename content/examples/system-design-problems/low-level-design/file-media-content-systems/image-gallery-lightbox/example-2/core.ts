export type ImageGalleryLightboxStage = "closed" | "opening" | "loading-active" | "prefetching-neighbors" | "ready" | "closed";

export type ImageGalleryLightboxTransition = {
  command: string;
  from: ImageGalleryLightboxStage;
  to: ImageGalleryLightboxStage;
  revision: number;
};

export type ImageGalleryLightboxState = {
  id: string;
  stage: ImageGalleryLightboxStage;
  revision: number;
  audit: string[];
};

// Keep navigation index stable while late image decodes are ignored by request generation.
export function applyImageGalleryLightboxTransition(
  state: ImageGalleryLightboxState,
  transition: ImageGalleryLightboxTransition,
): ImageGalleryLightboxState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid lightbox projection transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runImageGalleryLightboxProtocolScenario() {
  const transitions: ImageGalleryLightboxTransition[] = [
  { command: "open-index", from: "closed", to: "opening", revision: 1 },
  { command: "load-active", from: "opening", to: "loading-active", revision: 2 },
  { command: "prefetch-neighbors", from: "loading-active", to: "prefetching-neighbors", revision: 3 },
  { command: "navigate", from: "prefetching-neighbors", to: "ready", revision: 4 },
  { command: "close", from: "ready", to: "closed", revision: 5 },
  ];
  return transitions.reduce(applyImageGalleryLightboxTransition, {
    id: "image-gallery-lightbox-case-17",
    stage: "closed",
    revision: 0,
    audit: [],
  });
}

export const ImageGalleryLightboxInvariant =
  "Keep navigation index stable while late image decodes are ignored by request generation.";
