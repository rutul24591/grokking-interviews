type Stage = "dev" | "staging" | "production";
type RolloutStatus = "idle" | "promoted" | "rolled_back";

type RolloutState = {
  buildId: string;
  stage: Stage;
  status: RolloutStatus;
  updatedAt: string;
};

class RolloutRegistry {
  private byStage = new Map<Stage, RolloutState>();

  promote(stage: Stage, buildId: string): RolloutState {
    const existing = this.byStage.get(stage);
    if (existing?.status === "promoted" && existing.buildId === buildId) return existing; // idempotent

    const next: RolloutState = {
      buildId,
      stage,
      status: "promoted",
      updatedAt: new Date().toISOString()
    };
    this.byStage.set(stage, next);
    return next;
  }

  rollback(stage: Stage, buildId: string): RolloutState {
    const existing = this.byStage.get(stage);
    if (!existing) {
      return {
        buildId,
        stage,
        status: "rolled_back",
        updatedAt: new Date().toISOString()
      };
    }
    if (existing.status === "rolled_back" && existing.buildId === buildId) return existing; // idempotent
    if (existing.status === "promoted" && existing.buildId !== buildId) {
      throw new Error(`cannot rollback buildId=${buildId} because stage=${stage} has buildId=${existing.buildId}`);
    }

    const next: RolloutState = {
      buildId,
      stage,
      status: "rolled_back",
      updatedAt: new Date().toISOString()
    };
    this.byStage.set(stage, next);
    return next;
  }

  snapshot() {
    return Object.fromEntries([...this.byStage.entries()]);
  }
}

const registry = new RolloutRegistry();
console.log(JSON.stringify({ promote: registry.promote("production", "build-42") }, null, 2));
console.log(JSON.stringify({ promoteAgain: registry.promote("production", "build-42") }, null, 2));
console.log(JSON.stringify({ rollback: registry.rollback("production", "build-42") }, null, 2));
console.log(JSON.stringify({ snapshot: registry.snapshot() }, null, 2));

