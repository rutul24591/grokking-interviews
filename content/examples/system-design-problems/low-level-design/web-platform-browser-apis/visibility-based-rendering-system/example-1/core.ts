export type Visibility = "visible" | "hidden";

export type RenderPolicy = { pauseWhenHidden: boolean };

export function shouldRender(policy: RenderPolicy, visibility: Visibility) {
  if (!policy.pauseWhenHidden) return true;
  return visibility === "visible";
}
