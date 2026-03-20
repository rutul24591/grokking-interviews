export type DependencyMode =
  | { type: "healthy" }
  | { type: "always_fail" }
  | { type: "fail_first_n"; remaining: number };

class DependencySim {
  mode: DependencyMode = { type: "healthy" };

  setMode(mode: DependencyMode) {
    this.mode = mode;
  }

  call() {
    if (this.mode.type === "healthy") return { ok: true, value: "dep_ok" as const };
    if (this.mode.type === "always_fail") return { ok: false, error: "dep_failed" as const };
    if (this.mode.type === "fail_first_n") {
      if (this.mode.remaining > 0) {
        this.mode = { type: "fail_first_n", remaining: this.mode.remaining - 1 };
        return { ok: false, error: "dep_failed" as const };
      }
      return { ok: true, value: "dep_ok" as const };
    }
    return { ok: false, error: "dep_failed" as const };
  }
}

export const dependency = new DependencySim();

