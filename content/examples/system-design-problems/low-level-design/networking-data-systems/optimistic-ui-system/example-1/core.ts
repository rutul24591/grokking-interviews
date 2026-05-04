export type Mutation<TState> = {
  apply: (s: TState) => TState;
  rollback: (s: TState) => TState;
  id: string;
};

export function applyOptimistic<TState>(state: TState, mut: Mutation<TState>) {
  return mut.apply(state);
}

export function rollbackOptimistic<TState>(state: TState, mut: Mutation<TState>) {
  return mut.rollback(state);
}

export function createMutation<TState>(id: string, apply: (s: TState) => TState, rollback: (s: TState) => TState) {
  return { id, apply, rollback } satisfies Mutation<TState>;
}
