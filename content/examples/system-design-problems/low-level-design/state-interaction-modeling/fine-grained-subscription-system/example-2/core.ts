export type FineGrainedSubscriptionSystemEvent = "start" | "resolve" | "fail" | "cancel" | "reset";
export type FineGrainedSubscriptionSystemState = "idle" | "pending" | "success" | "error" | "cancelled";

export interface Transition<Event extends string, State extends string> {
  from: State;
  event: Event;
  to: State;
  guard?: (ctx: { version: number; owner?: string }) => boolean;
  effect?: "none" | "run" | "rollback" | "notify";
}

export class TransitionTable<Event extends string, State extends string> {
  private version = 0;
  private rejectionLog: Array<{ event: Event; from: State; reason: string }> = [];
  private acceptedLog: Array<{ event: Event; to: State; version: number; effect: string }> = [];

  constructor(private state: State, private readonly transitions: Array<Transition<Event, State>>) {}

  current(): State {
    return this.state;
  }

  rejected(): Array<{ event: Event; from: State; reason: string }> {
    return [...this.rejectionLog];
  }

  accepted(): Array<{ event: Event; to: State; version: number; effect: string }> {
    return [...this.acceptedLog];
  }

  send(event: Event, owner?: string): { accepted: true; state: State; version: number } | { accepted: false; reason: string; state: State } {
    const transition = this.transitions.find((candidate) => candidate.from === this.state && candidate.event === event);
    if (!transition) {
      const reason = "invalid-transition";
      this.rejectionLog.push({ event, from: this.state, reason });
      return { accepted: false, reason, state: this.state };
    }
    if (transition.guard && !transition.guard({ version: this.version, owner })) {
      const reason = "guard-rejected";
      this.rejectionLog.push({ event, from: this.state, reason });
      return { accepted: false, reason, state: this.state };
    }
    this.state = transition.to;
    this.version += 1;
    this.acceptedLog.push({ event, to: this.state, version: this.version, effect: transition.effect ?? "none" });
    return { accepted: true, state: this.state, version: this.version };
  }

  can(event: Event): boolean {
    return this.transitions.some((transition) => transition.from === this.state && transition.event === event);
  }

  assertTerminal(): boolean {
    return this.state === "success" || this.state === "error" || this.state === "cancelled";
  }
}

export const fineGrainedSubscriptionSystemTransitions: Array<Transition<FineGrainedSubscriptionSystemEvent, FineGrainedSubscriptionSystemState>> = [
  { from: "idle", event: "start", to: "pending", effect: "run" },
  { from: "pending", event: "resolve", to: "success", guard: ({ owner }) => owner !== "stale-caller", effect: "notify" },
  { from: "pending", event: "fail", to: "error", effect: "rollback" },
  { from: "pending", event: "cancel", to: "cancelled", effect: "rollback" },
  { from: "success", event: "reset", to: "idle" },
  { from: "error", event: "reset", to: "idle" },
  { from: "cancelled", event: "reset", to: "idle" },
];

export function buildFineGrainedSubscriptionSystemTransitionTable(): TransitionTable<FineGrainedSubscriptionSystemEvent, FineGrainedSubscriptionSystemState> {
  return new TransitionTable<FineGrainedSubscriptionSystemEvent, FineGrainedSubscriptionSystemState>("idle", fineGrainedSubscriptionSystemTransitions);
}
