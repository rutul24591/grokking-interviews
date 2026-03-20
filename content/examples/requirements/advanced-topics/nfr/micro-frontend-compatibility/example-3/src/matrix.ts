export type Compat = "full" | "shim" | "blocked";

export function compatibility(params: { host: number; remote: number }): Compat {
  if (params.host >= 2 && params.remote >= 2) return "full";
  if (params.host >= 2 && params.remote === 1) return "shim";
  if (params.host === 1 && params.remote === 1) return "full";
  return "blocked";
}

