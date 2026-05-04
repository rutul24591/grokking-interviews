export type Token = { name: string; value: string; scope: "global" | "component" };

export type Theme = { id: string; name: string; tokens: Token[]; version: number };

export type PackageVersion = { version: string; publishedAt: number; changelog: string };

export type ComponentPackage = {
  name: string;
  versions: PackageVersion[];
  tokens: Token[];
  themes: Theme[];
};

export function publish(pkg: ComponentPackage, v: PackageVersion) {
  return { ...pkg, versions: [v, ...pkg.versions].sort((a, b) => b.publishedAt - a.publishedAt) };
}

export function resolveToken(theme: Theme, tokenName: string) {
  return theme.tokens.find((t) => t.name === tokenName)?.value ?? null;
}
