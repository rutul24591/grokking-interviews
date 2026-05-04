export type StateId = string;
export type Event = { type: string; payload?: unknown };

export type Transition = { from: StateId; on: string; to: StateId; guard?: (ctx: unknown) => boolean };

export type Machine = { initial: StateId; transitions: Transition[] };

export function nextState(machine: Machine, current: StateId, event: Event, ctx: unknown) {
  const t = machine.transitions.find((x) => x.from === current && x.on === event.type && (x.guard ? x.guard(ctx) : true));
  return t ? t.to : current;
}
