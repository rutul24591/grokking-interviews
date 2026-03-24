import manifest from "@/lib/generated/assets-manifest.json";

const m = manifest as Record<string, string>;

export function assetUrl(logicalName: string): string {
  return m[logicalName] ?? `/assets/${logicalName}`;
}

