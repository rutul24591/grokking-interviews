export type TokenTier = "global" | "semantic" | "component";
export interface TokenDefinition { name: string; tier: TokenTier; value?: string; alias?: string; }
export class TokenGraph {
  private tokens = new Map<string, TokenDefinition>();
  define(token: TokenDefinition): void { if (this.tokens.has(token.name)) throw new Error("duplicate-token"); this.tokens.set(token.name, token); }
  resolve(name: string, stack: string[] = []): string {
    if (stack.includes(name)) throw new Error("token-alias-cycle:" + [...stack, name].join("->"));
    const token = this.tokens.get(name); if (!token) throw new Error("missing-token:" + name);
    if (token.value) return token.value; if (!token.alias) throw new Error("token-has-no-value:" + name);
    return this.resolve(token.alias, [...stack, name]);
  }
  compile(names: string[]): Record<string, string> { return Object.fromEntries(names.map((name) => [name, this.resolve(name)])); }
}
export function runTokenScenario() {
  const graph = new TokenGraph();
  graph.define({ name: "blue-500", tier: "global", value: "#2563eb" });
  graph.define({ name: "action-primary", tier: "semantic", alias: "blue-500" });
  graph.define({ name: "button-background", tier: "component", alias: "action-primary" });
  return graph.compile(["button-background"]);
}
