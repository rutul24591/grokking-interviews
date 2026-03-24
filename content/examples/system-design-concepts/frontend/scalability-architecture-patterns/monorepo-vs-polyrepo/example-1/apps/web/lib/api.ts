import { featureFlagsResponseSchema, type FeatureFlagsResponse } from "@acme/contracts";

export async function fetchFlags(): Promise<FeatureFlagsResponse> {
  const res = await fetch("http://localhost:4001/flags", { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return featureFlagsResponseSchema.parse(json);
}

