export type Values = Record<string, unknown>;

export type FieldState = {
  visible: boolean;
  enabled: boolean;
  required: boolean;
};

export type RuleEffect = Partial<FieldState> & {
  // Optional: clear a field when it becomes hidden/disabled.
  clearValue?: boolean;
};

export type Rule = {
  id: string;
  target: string;
  dependsOn: string[];
  when: (values: Values) => boolean;
  then: RuleEffect;
  else?: RuleEffect;
};

export type CompiledEngine = {
  rulesByDependency: Map<string, Rule[]>;
  allTargets: Set<string>;
};

export function compileRules(rules: Rule[]): CompiledEngine {
  const rulesByDependency = new Map<string, Rule[]>();
  const allTargets = new Set<string>();

  for (const r of rules) {
    allTargets.add(r.target);
    for (const dep of r.dependsOn) {
      const arr = rulesByDependency.get(dep) ?? [];
      arr.push(r);
      rulesByDependency.set(dep, arr);
    }
  }

  // Cycle detection (targets depending on each other via dependsOn graph).
  // In production, you’d build a full graph; here we detect obvious self-cycles + mutual cycles.
  for (const r of rules) {
    if (r.dependsOn.includes(r.target)) {
      throw new Error(`Rule ${r.id} creates self-cycle on ${r.target}`);
    }
  }

  return { rulesByDependency, allTargets };
}

export function defaultFieldState(): FieldState {
  return { visible: true, enabled: true, required: false };
}

export function applyEffect(state: FieldState, effect: RuleEffect | undefined): FieldState {
  if (!effect) return state;
  return {
    visible: effect.visible ?? state.visible,
    enabled: effect.enabled ?? state.enabled,
    required: effect.required ?? state.required,
  };
}

export function evaluateAll(values: Values, rules: Rule[]): Record<string, FieldState> {
  const state: Record<string, FieldState> = {};
  for (const r of rules) state[r.target] = state[r.target] ?? defaultFieldState();
  for (const r of rules) {
    const hit = r.when(values);
    state[r.target] = applyEffect(state[r.target], hit ? r.then : r.else);
  }
  return state;
}

export function affectedRules(engine: CompiledEngine, changedField: string): Rule[] {
  return engine.rulesByDependency.get(changedField) ?? [];
}

