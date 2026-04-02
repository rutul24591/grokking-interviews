export type Config = { version: string; flags: Record<string, boolean> };

let v = 1;
export function bumpConfig() {
  v++;
}

export function getConfig(): Config {
  return {
    version: `v${v}`,
    flags: { newNav: v % 2 === 0, compactCards: v % 3 === 0 }
  };
}

